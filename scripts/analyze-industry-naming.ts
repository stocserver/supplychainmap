/**
 * Analyze Industry Naming Script
 * Scans all industry product files and uses LLM to propose better segment names
 * 
 * Usage: npx tsx scripts/analyze-industry-naming.ts
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

const INDUSTRIES_DIR = path.resolve(__dirname, '../lib/industries')

async function analyzeIndustry(filename: string) {
    const slug = filename.replace('.products.ts', '')
    const content = fs.readFileSync(path.join(INDUSTRIES_DIR, filename), 'utf-8')

    // Quick regex scan to extract structure (simulating import without executing code)
    // We want to find "stageLabel: '...'" and "name: '...'"

    const prompt = `
    You are an expert industrial taxonomy analyst.
    I have a JSON-like structure defining the Value Chain for the "${slug}" industry.
    
    Current Problem: 
    - Stage labels might be generic ("Upstream", "Midstream", "Downstream").
    - Category names might be vague ("Applications", "Services", "General").
    
    Your Goal:
    - Propose SPECIFIC, DESCRIPTIVE names for the 3 stages (Upstream/Midstream/Downstream).
    - Identify any vague Category names and propose better ones.
    
    Here is the code file content:
    \`\`\`typescript
    ${content.slice(0, 5000)} // Truncate if too long, usually fits
    \`\`\`
    
    Output Format (JSON Only):
    {
        "industry": "${slug}",
        "proposed_stages": {
            "upstream": "Specific Name",
            "midstream": "Specific Name",
            "downstream": "Specific Name"
        },
        "category_improvements": [
            { "current": "Old Name", "proposed": "New Specific Name", "reason": "Why" }
        ],
        "quality_score": 1-10 (1=Generic, 10=Perfect)
    }
    `

    try {
        const result = await model.generateContent(prompt)
        const text = result.response.text()
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
    } catch (e) {
        console.error(`Error analyzing ${slug}:`, e)
    }
    return null
}

async function main() {
    console.log('🚀 Analyzing Industry Naming Standards...\n')

    const files = fs.readdirSync(INDUSTRIES_DIR).filter(f => f.endsWith('.products.ts'))
    console.log(`Found ${files.length} industry files.`)

    const results = []

    // Run in parallel chunks or sequential? Sequential to avoid rate limits.
    for (const file of files) {
        process.stdout.write(`Analyzing ${file}... `)
        const analysis = await analyzeIndustry(file)
        if (analysis) {
            console.log(`✅ Score: ${analysis.quality_score}`)
            results.push(analysis)
        } else {
            console.log('❌ Failed')
        }
        // Small delay
        await new Promise(r => setTimeout(r, 500))
    }

    // Generate Report
    let markdown = '# Industry Naming Audit Report\n\n'
    markdown += '| Industry | Score | Proposed Upstream | Proposed Midstream | Proposed Downstream | Changes |\n'
    markdown += '| :--- | :--- | :--- | :--- | :--- | :--- |\n'

    results.sort((a, b) => a.quality_score - b.quality_score) // Worst first

    for (const r of results) {
        const cats = r.category_improvements.map((c: any) => `"${c.current}" -> "**${c.proposed}**"`).join('<br>')
        markdown += `| **${r.industry}** | ${r.quality_score} | ${r.proposed_stages.upstream} | ${r.proposed_stages.midstream} | ${r.proposed_stages.downstream} | ${cats} |\n`
    }

    fs.writeFileSync('naming_audit.md', markdown)
    console.log('\n📄 Report generated: naming_audit.md')
}

main()
