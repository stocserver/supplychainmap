/**
 * Apply Industry Naming Improvements
 * Scans industry files, uses LLM to generate improved names, and updates the files in-place.
 * 
 * Usage: npx tsx scripts/apply-industry-naming.ts
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

const INDUSTRIES_DIR = path.resolve(__dirname, '../lib/industries')

async function improveFile(filename: string) {
    const slug = filename.replace('.products.ts', '')
    const filePath = path.join(INDUSTRIES_DIR, filename)
    let content = fs.readFileSync(filePath, 'utf-8')

    // We want to replace "stageLabel" and "name" values.
    // We will ask LLM to provide a replacement JSON.

    const prompt = `
    You are an expert industrial taxonomy editor.
    I have a TypeScript file defining the Value Chain for the "${slug}" industry.
    
    Current Problem: 
    - Stage labels are generic ("Upstream", "Midstream", "Downstream").
    - Category names might be vague ("Applications", "Services", "General").
    
    Your Task:
    - Return a JSON object mapping the EXACT OLD STRING to the BETTER NEW STRING.
    - ONLY change 'stageLabel' values (Upstream/Midstream/Downstream).
    - ONLY change 'name' values for Categories/Products that are vague.
    - DO NOT change 'id' or 'slugs'.
    - DO NOT change specific, good names (e.g. keep "Lithium Mining", change "General" to "Lithium Trading").
    - The 'Old String' must match exactly what is in the file.
    
    File Content:
    \`\`\`typescript
    ${content}
    \`\`\`
    
    Output Format (JSON Only):
    {
        "replacements": [
            { "old": "Upstream", "new": "Raw Material Extraction" },
            { "old": "Applications", "new": "Specific Applications" }
        ]
    }
    `

    try {
        const result = await model.generateContent(prompt)
        const text = result.response.text()
        const jsonMatch = text.match(/\{[\s\S]*\}/)

        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0])
            let updatedContent = content
            let changes = 0

            for (const rep of data.replacements) {
                // Determine context to avoid replacing random words
                // We only want to replace values of keys 'stageLabel' or 'name'
                // But simple string replacement is safer if the old string is unique enough
                // 'Upstream' might be common.
                // Better regex: stageLabel: 'Upstream' -> stageLabel: 'New'

                // Try strict replacement first
                const strictRegex = new RegExp(`(['"])` + rep.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + `(['"])`, 'g')

                if (strictRegex.test(updatedContent)) {
                    updatedContent = updatedContent.replace(strictRegex, `$1${rep.new}$2`)
                    changes++
                }
            }

            if (changes > 0) {
                fs.writeFileSync(filePath, updatedContent)
                console.log(`✅ Updated ${filename}: ${changes} changes.`)
                return true
            } else {
                console.log(`⚠️ No changes applied for ${filename}`)
            }
        }
    } catch (e) {
        console.error(`Error updating ${slug}:`, e)
    }
    return false
}

async function main() {
    console.log('🚀 Applying Naming Improvements...\n')

    const files = fs.readdirSync(INDUSTRIES_DIR).filter(f => f.endsWith('.products.ts'))

    for (const file of files) {
        process.stdout.write(`Processing ${file}... `)
        await improveFile(file)
        await new Promise(r => setTimeout(r, 1000)) // Rate limit
    }

    console.log('\n✨ All files processed.')
}

main()
