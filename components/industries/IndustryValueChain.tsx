'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ChevronRight, Building2 } from 'lucide-react'
import { ValueChain, ValueChainSegment } from '@/lib/data/industries'
import { CompanyCard } from '@/components/companies/company-card'

interface IndustryValueChainProps {
  valueChain: ValueChain
  industryName: string
  explanations?: {
    upstream: string
    midstream: string
    downstream: string
  }
}

interface SegmentData {
  id: string
  name: string
  description: string
  companies: string[]
}

const defaultExplanations: Record<string, { upstream: string; midstream: string; downstream: string }> = {
  semiconductors: {
    upstream: 'The upstream segment focuses on chip design and intellectual property. This includes fabless semiconductor companies that design chips without owning manufacturing facilities, as well as IP providers that create reusable circuit designs.',
    midstream: 'The midstream segment encompasses wafer fabrication and manufacturing. This is the most capital-intensive part of the value chain, requiring billions of dollars in equipment and facilities. Foundries use advanced lithography and etching processes to create billions of transistors on silicon wafers.',
    downstream: 'The downstream segment handles packaging, testing, and distribution. After wafer fabrication, individual chips are cut, packaged to protect them and provide electrical connections, and rigorously tested before being distributed to electronics manufacturers worldwide.',
  },
  'artificial-intelligence': {
    upstream: 'The upstream includes AI-specific hardware like GPUs and TPUs, along with the data infrastructure necessary for training large models. This forms the computational foundation that powers all AI applications.',
    midstream: 'The midstream encompasses ML platforms, frameworks, and AI software services that enable developers to build, train, and deploy AI models. This includes cloud-based AI APIs and development tools.',
    downstream: 'The downstream delivers AI-powered applications and solutions to end users across industries, from business intelligence to automation, along with consulting services that help organizations implement AI strategies.',
  },
  'cloud-computing': {
    upstream: 'The upstream provides the physical foundation with data center facilities, networking hardware, and infrastructure components that enable cloud services to operate at scale.',
    midstream: 'The midstream offers cloud platforms (IaaS/PaaS), database services, and storage solutions that developers use to build and deploy applications without managing physical infrastructure.',
    downstream: 'The downstream delivers SaaS applications to end users and provides cloud management tools that help organizations monitor, optimize, and secure their cloud resources.',
  },
  cybersecurity: {
    upstream: 'The upstream includes threat intelligence research, vulnerability discovery, and security hardware that form the foundation of cybersecurity defenses.',
    midstream: 'The midstream provides endpoint security, network protection, and identity management solutions that actively defend against cyber threats across devices, networks, and user access.',
    downstream: 'The downstream offers cloud security solutions and managed security services that protect cloud infrastructure and provide expert security operations to organizations.',
  },
  'software-saas': {
    upstream: 'The upstream provides development tools, IDEs, and platforms that software developers use to build applications and services.',
    midstream: 'The midstream delivers enterprise applications like CRM and ERP, collaboration tools, and analytics platforms that businesses rely on for daily operations.',
    downstream: 'The downstream offers industry-specific vertical SaaS solutions and integration platforms that connect various software systems and automate workflows.',
  },
  'electric-vehicles': {
    upstream: 'The upstream includes mining and processing of raw materials critical for EV production, such as lithium, cobalt, nickel, and rare earth elements. These materials are refined into battery-grade materials including cathode and anode materials, electrolytes, and separators.',
    midstream: 'The midstream focuses on manufacturing battery cells and packs with battery management systems, as well as producing key EV components like electric motors, power electronics, and inverters. This is where raw materials are transformed into the core technologies that power electric vehicles.',
    downstream: 'The downstream encompasses vehicle assembly by both pure EV manufacturers and traditional automakers, development of charging infrastructure networks, and provision of sales, service, and software solutions including autonomous driving technology and over-the-air updates.',
  },
  'solar-energy': {
    upstream: 'The upstream begins with polysilicon production and wafer manufacturing, creating the base materials needed for solar cell production.',
    midstream: 'The midstream converts silicon wafers into solar cells and assembles them into complete photovoltaic modules, along with producing inverters that convert DC to AC power.',
    downstream: 'The downstream handles residential and commercial solar installation, providing turnkey solar solutions and managing utility-scale solar projects.',
  },
  'energy-storage': {
    upstream: 'The upstream sources and processes battery materials like lithium, cobalt, and nickel needed for energy storage systems.',
    midstream: 'The midstream develops battery cell technology and manufactures complete energy storage systems including batteries, inverters, and management software.',
    downstream: 'The downstream delivers residential battery systems for homes and grid-scale storage solutions that help utilities stabilize power grids and integrate renewable energy.',
  },
  pharmaceuticals: {
    upstream: 'The upstream conducts drug discovery research, identifies therapeutic targets, and manages clinical trials to develop new medicines.',
    midstream: 'The midstream focuses on large-scale pharmaceutical manufacturing, producing both finished drugs and active pharmaceutical ingredients (APIs) under strict quality controls.',
    downstream: 'The downstream handles pharmaceutical distribution through wholesalers and provides retail pharmacy services that deliver medications to patients.',
  },
  biotechnology: {
    upstream: 'The upstream provides research tools, genomic sequencing platforms, and gene editing technologies like CRISPR that enable biotech innovation.',
    midstream: 'The midstream develops biologics, gene therapies, and molecular diagnostics that represent cutting-edge therapeutic and diagnostic solutions.',
    downstream: 'The downstream commercializes biotech therapies and provides contract development and manufacturing (CDMO) services for other biotech companies.',
  },
  'medical-devices': {
    upstream: 'The upstream supplies medical-grade materials, sensors, and electronic components used in device manufacturing.',
    midstream: 'The midstream manufactures medical devices, implants, diagnostic equipment, and wearable health monitors that support patient care.',
    downstream: 'The downstream distributes medical devices to healthcare facilities and provides installation, maintenance, and technical support services.',
  },
  'digital-health': {
    upstream: 'The upstream provides health data infrastructure, electronic health record systems, and health IT platforms that digitize medical information.',
    midstream: 'The midstream delivers telehealth platforms and remote patient monitoring systems that enable virtual care and chronic disease management.',
    downstream: 'The downstream offers direct-to-consumer health apps and AI-powered health analytics that empower individuals and support clinical decision-making.',
  },
  'aerospace-defense': {
    upstream: 'The upstream supplies specialized aerospace materials, alloys, and critical components like engines, avionics, and landing gear.',
    midstream: 'The midstream manufactures commercial and military aircraft, along with defense systems including missiles, radar, and electronic warfare equipment.',
    downstream: 'The downstream serves airlines and operators while providing maintenance, repair, and overhaul (MRO) services to keep aircraft operational.',
  },
  'space-technology': {
    upstream: 'The upstream produces satellite components, sensors, and propulsion systems for space applications.',
    midstream: 'The midstream manufactures satellites and provides launch services to deliver payloads into orbit.',
    downstream: 'The downstream operates satellite communications, Earth observation services, and ground systems that process and distribute space-based data.',
  },
  fintech: {
    upstream: 'The upstream provides payment network infrastructure and blockchain platforms that enable digital financial transactions.',
    midstream: 'The midstream delivers payment processing, merchant services, and digital banking platforms that modernize financial services.',
    downstream: 'The downstream offers consumer financial apps for investing and trading, along with B2B fintech solutions for business payments and financial management.',
  },
  ecommerce: {
    upstream: 'The upstream provides e-commerce platform software and payment gateway solutions that power online stores.',
    midstream: 'The midstream operates online marketplaces and direct-to-consumer retail sites where products are bought and sold.',
    downstream: 'The downstream manages fulfillment, warehousing, and last-mile delivery, along with online travel booking platforms.',
  },
  'robotics-automation': {
    upstream: 'The upstream supplies sensors, actuators, and AI/computer vision systems that give robots perception and control capabilities.',
    midstream: 'The midstream manufactures industrial robots for factories, surgical robots for healthcare, and 3D printing systems for additive manufacturing.',
    downstream: 'The downstream deploys warehouse automation systems and consumer service robots for homes and commercial applications.',
  },
  'data-centers': {
    upstream: 'The upstream provides power infrastructure and cooling systems essential for data center operations.',
    midstream: 'The midstream supplies servers, storage systems, and operates colocation facilities and data center REITs.',
    downstream: 'The downstream delivers hyperscale data centers for cloud providers and edge computing infrastructure for distributed workloads.',
  },
  telecommunications: {
    upstream: 'The upstream manufactures network equipment like 5G base stations and builds cell tower infrastructure for wireless coverage.',
    midstream: 'The midstream operates wireless carrier networks and fiber optic networks that provide connectivity services.',
    downstream: 'The downstream delivers consumer wireless and broadband services, along with enterprise networking and IoT solutions.',
  },
  agtech: {
    upstream: 'The upstream develops genetically modified seeds, crop protection products, and manufactures fertilizers that boost agricultural productivity.',
    midstream: 'The midstream produces agricultural equipment like tractors and combines, along with precision agriculture technology including GPS guidance and sensors.',
    downstream: 'The downstream provides farming services and handles agricultural product processing and distribution to food manufacturers.',
  },
  banking: {
    upstream: 'The upstream provides core banking technology platforms, financial data, credit ratings, and market analytics that support banking operations.',
    midstream: 'The midstream delivers commercial banking, investment banking, and wealth management services to businesses and high-net-worth individuals.',
    downstream: 'The downstream serves retail banking customers with checking, savings, and mortgages, plus credit card services for consumer payments.',
  },
  insurance: {
    upstream: 'The upstream includes reinsurance that transfers risk between insurers, and actuarial analytics that model risk for pricing insurance products.',
    midstream: 'The midstream underwrites life insurance, property & casualty insurance, and health insurance policies that protect individuals and businesses.',
    downstream: 'The downstream distributes insurance through brokers and agents, and processes claims to settle covered losses.',
  },
  'asset-management': {
    upstream: 'The upstream operates stock exchanges, futures markets, and provides financial indices and market data that support investment activities.',
    midstream: 'The midstream manages institutional and traditional asset management products, as well as alternative investments like private equity and credit.',
    downstream: 'The downstream distributes investment products through advisors and provides investor services including custody and fund administration.',
  },
  'real-estate': {
    upstream: 'The upstream acquires land and manages construction projects for real estate development.',
    midstream: 'The midstream operates various REIT categories including residential apartments, commercial office buildings, and specialized properties like data centers and healthcare facilities.',
    downstream: 'The downstream provides property management services and real estate brokerage for property transactions.',
  },
  'oil-gas': {
    upstream: 'The upstream explores for oil and gas reserves, drills wells, and produces crude oil and natural gas, supported by oilfield services companies.',
    midstream: 'The midstream transports oil and gas through pipelines, stores it, and refines crude oil into gasoline, diesel, and petrochemicals.',
    downstream: 'The downstream markets and distributes petroleum products through gas stations and produces petrochemical derivatives.',
  },
  'mining-materials': {
    upstream: 'The upstream mines precious metals, copper, iron ore, and produces industrial gases like oxygen and nitrogen.',
    midstream: 'The midstream produces steel and aluminum, manufactures specialty chemicals and coatings, and makes cement and construction aggregates.',
    downstream: 'The downstream produces packaging materials and distributes metals, materials, and industrial supplies to manufacturers.',
  },
  chemicals: {
    upstream: 'The upstream supplies petrochemical feedstock and raw materials for chemical production.',
    midstream: 'The midstream manufactures basic commodity chemicals and polymers, produces specialty chemicals and coatings, and makes agricultural fertilizers and pesticides.',
    downstream: 'The downstream delivers chemical products to end markets in automotive, construction, and consumer goods industries.',
  },
  'food-beverage': {
    upstream: 'The upstream sources agricultural commodities and processes food ingredients, flavors, and sweeteners.',
    midstream: 'The midstream manufactures packaged foods, produces soft drinks and alcoholic beverages, and makes confectionery and snack products.',
    downstream: 'The downstream distributes food through grocery retail and operates restaurants and food service establishments.',
  },
  'consumer-products': {
    upstream: 'The upstream supplies chemicals, fragrances, and raw materials for consumer product manufacturing.',
    midstream: 'The midstream produces personal care products like skincare and cosmetics, household cleaning products and paper goods, and tobacco products.',
    downstream: 'The downstream distributes consumer products through mass retailers, drugstores, and online platforms.',
  },
  automotive: {
    upstream: 'The upstream supplies automotive parts and components from tier 1 and tier 2 suppliers, and manufactures tires for vehicles.',
    midstream: 'The midstream assembles traditional internal combustion engine and hybrid vehicles in manufacturing plants.',
    downstream: 'The downstream sells vehicles through franchised dealerships and provides aftermarket parts and automotive repair services.',
  },
  retail: {
    upstream: 'The upstream handles global sourcing and private label manufacturing for retail brands.',
    midstream: 'The midstream operates discount stores and warehouse clubs, specialty retailers for categories like home improvement and electronics, and apparel and fashion retailers.',
    downstream: 'The downstream provides omnichannel shopping experiences combining physical stores with e-commerce and delivery services.',
  },
  'media-entertainment': {
    upstream: 'The upstream produces film, TV, and music content, and develops video games for various platforms.',
    midstream: 'The midstream operates streaming platforms for video and music, social media networks for user-generated content, and traditional cable and broadcast media.',
    downstream: 'The downstream monetizes content through digital advertising platforms and produces live entertainment including concerts and sporting events.',
  },
  hospitality: {
    upstream: 'The upstream develops hotels, casinos, and resort properties.',
    midstream: 'The midstream operates hotel chains and resorts, casino and gaming facilities, and cruise lines.',
    downstream: 'The downstream provides online travel booking platforms and travel services including loyalty programs.',
  },
  utilities: {
    upstream: 'The upstream generates electricity from fossil fuels, nuclear, and renewable sources like solar, wind, and hydro.',
    midstream: 'The midstream transmits and distributes electric power through transmission lines and distribution networks, and distributes natural gas to customers.',
    downstream: 'The downstream provides retail electric service to homes and businesses, and supplies water and wastewater services.',
  },
  'transportation-logistics': {
    upstream: 'The upstream manufactures trucks, railcars, aircraft, and shipping containers used in transportation.',
    midstream: 'The midstream provides freight trucking and logistics services, operates freight rail networks, and flies passenger airlines.',
    downstream: 'The downstream handles last-mile package delivery and provides third-party logistics (3PL) and supply chain management services.',
  },
  'construction-engineering': {
    upstream: 'The upstream provides engineering consulting and design services, and manufactures construction equipment and heavy machinery.',
    midstream: 'The midstream performs construction contracting and project management, manufactures building products and materials, and produces HVAC systems and building controls.',
    downstream: 'The downstream manages building facilities and maintenance, and distributes tools, fasteners, and industrial supplies.',
  },
}

export function IndustryValueChain({
  valueChain,
  industryName,
  explanations,
}: IndustryValueChainProps) {
  const [selectedSegment, setSelectedSegment] = useState<SegmentData | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSegmentClick = (segment: ValueChainSegment, subcategoryId?: string) => {
    if (subcategoryId && segment.subcategories) {
      const subcategory = segment.subcategories.find((s) => s.id === subcategoryId)
      if (subcategory) {
        setSelectedSegment({
          id: subcategory.id,
          name: subcategory.name,
          description: subcategory.description || '',
          companies: subcategory.companies || [],
          products: subcategory.products || [],
        } as any)
        setIsDialogOpen(true)
      }
    } else {
      setSelectedSegment({
        id: segment.id,
        name: segment.name,
        description: segment.description,
        companies: segment.companies || [],
        products: segment.products || [],
      } as any)
      setIsDialogOpen(true)
    }
  }

  // Get explanations from props or use defaults based on industry slug
  const industrySlug = industryName.toLowerCase().replace(/\s+/g, '-')
  const activeExplanations =
    explanations ||
    defaultExplanations[industrySlug as keyof typeof defaultExplanations] ||
    defaultExplanations.semiconductors

  return (
    <div className="space-y-8">
      {/* Value Chain Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>{industryName} Value Chain</CardTitle>
          <CardDescription>
            Click on any segment to view companies and detailed information
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {/* Horizontal Layout - Centered */}
          <div className="flex items-start justify-center gap-4 pb-4">
              {/* Upstream Section */}
            <div className="flex flex-col gap-4">
              <h3 className="text-center text-sm font-semibold text-blue-600">Upstream</h3>
              <div className="flex flex-col gap-3">
                {valueChain.upstream.map((segment) => (
                  <button
                    key={segment.id}
                    onClick={() => handleSegmentClick(segment)}
                    className="group w-full md:w-56 rounded-lg border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-sm transition-all hover:scale-105 hover:border-blue-500 hover:shadow-md"
                  >
                    <div className="text-left">
                      <p className="text-sm font-semibold text-blue-900 mb-2">{segment.name}</p>
                      {segment.products && segment.products.length > 0 && (
                        <div className="space-y-1 mb-2">
                          {segment.products.slice(0, 4).map((product, idx) => (
                            <p key={idx} className="text-xs text-blue-700 leading-relaxed">
                              • {product}
                            </p>
                          ))}
                          {segment.products.length > 4 && (
                            <p className="text-xs text-blue-600 italic">
                              +{segment.products.length - 4} more...
                            </p>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-blue-600 font-medium">
                        {segment.companies?.length || 0} companies
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center pt-12">
              <ChevronRight className="h-8 w-8 text-gray-400" />
            </div>

            {/* Midstream Section */}
            <div className="flex flex-col gap-4">
              <h3 className="text-center text-sm font-semibold text-purple-600">Midstream</h3>
              {valueChain.midstream.map((segment) => (
                <div key={segment.id} className="flex flex-col gap-3">
                  <button
                    onClick={() => handleSegmentClick(segment)}
                    className="group w-full md:w-72 rounded-lg border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100 p-4 shadow-sm transition-all hover:scale-105 hover:border-purple-500 hover:shadow-md"
                  >
                    <div className="text-left">
                      <p className="text-sm font-semibold text-purple-900 mb-2">{segment.name}</p>
                      {segment.products && segment.products.length > 0 && (
                        <div className="space-y-1 mb-2">
                          {segment.products.slice(0, 4).map((product, idx) => (
                            <p key={idx} className="text-xs text-purple-700 leading-relaxed">
                              • {product}
                            </p>
                          ))}
                          {segment.products.length > 4 && (
                            <p className="text-xs text-purple-600 italic">
                              +{segment.products.length - 4} more...
                            </p>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-purple-600 font-medium">
                        {segment.companies?.length || 0} companies
                      </p>
                    </div>
                  </button>

                  {/* Subcategories */}
                  {segment.subcategories && (
                    <div className="flex flex-col gap-2">
                      {segment.subcategories.map((subcategory) => (
                        <button
                          key={subcategory.id}
                          onClick={() => handleSegmentClick(segment, subcategory.id)}
                          className="group w-full md:w-72 rounded border-2 border-purple-200 bg-white p-3 text-left shadow-sm transition-all hover:scale-105 hover:border-purple-400 hover:shadow-md"
                        >
                          <p className="text-xs font-medium text-purple-800 mb-1">
                            {subcategory.name}
                          </p>
                          {subcategory.products && subcategory.products.length > 0 && (
                            <div className="space-y-0.5 mb-1">
                              {subcategory.products.slice(0, 3).map((product, idx) => (
                                <p key={idx} className="text-xs text-purple-600 leading-relaxed">
                                  • {product}
                                </p>
                              ))}
                              {subcategory.products.length > 3 && (
                                <p className="text-xs text-purple-500 italic">
                                  +{subcategory.products.length - 3} more...
                                </p>
                              )}
                            </div>
                          )}
                          <p className="text-xs text-purple-500 font-medium">
                            {subcategory.companies?.length || 0} companies
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Arrow */}
            <div className="flex items-center pt-12">
              <ChevronRight className="h-8 w-8 text-gray-400" />
            </div>

            {/* Downstream Section */}
            <div className="flex flex-col gap-4">
              <h3 className="text-center text-sm font-semibold text-green-600">Downstream</h3>
              <div className="flex flex-col gap-3">
                {valueChain.downstream.map((segment) => (
                  <div key={segment.id} className="flex flex-col gap-2">
                    <button
                      onClick={() => handleSegmentClick(segment)}
                      className="group w-full md:w-72 rounded-lg border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100 p-4 shadow-sm transition-all hover:scale-105 hover:border-green-500 hover:shadow-md"
                    >
                      <div className="text-left">
                        <p className="text-sm font-semibold text-green-900 mb-2">{segment.name}</p>
                        {segment.products && segment.products.length > 0 && (
                          <div className="space-y-1 mb-2">
                            {segment.products.slice(0, 4).map((product, idx) => (
                              <p key={idx} className="text-xs text-green-700 leading-relaxed">
                                • {product}
                              </p>
                            ))}
                            {segment.products.length > 4 && (
                              <p className="text-xs text-green-600 italic">
                                +{segment.products.length - 4} more...
                              </p>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-green-600 font-medium">
                          {segment.companies?.length || 0} companies
                        </p>
                      </div>
                    </button>

                    {/* Subcategories */}
                    {segment.subcategories && (
                      <div className="flex flex-col gap-2">
                        {segment.subcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            onClick={() => handleSegmentClick(segment, subcategory.id)}
                            className="group w-full md:w-72 rounded border-2 border-green-200 bg-white p-3 text-left shadow-sm transition-all hover:scale-105 hover:border-green-400 hover:shadow-md"
                          >
                            <p className="text-xs font-medium text-green-800 mb-1">
                              {subcategory.name}
                            </p>
                            {subcategory.products && subcategory.products.length > 0 && (
                              <div className="space-y-0.5 mb-1">
                                {subcategory.products.slice(0, 3).map((product, idx) => (
                                  <p key={idx} className="text-xs text-green-600 leading-relaxed">
                                    • {product}
                                  </p>
                                ))}
                                {subcategory.products.length > 3 && (
                                  <p className="text-xs text-green-500 italic">
                                    +{subcategory.products.length - 3} more...
                                  </p>
                                )}
                              </div>
                            )}
                            <p className="text-xs text-green-500 font-medium">
                              {subcategory.companies?.length || 0} companies
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Dialog Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[85vh] max-w-5xl overflow-y-auto">
          {selectedSegment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <Building2 className="h-6 w-6" />
                  {selectedSegment.name}
                </DialogTitle>
                <DialogDescription className="text-base leading-relaxed pt-2">
                  {selectedSegment.description}
                </DialogDescription>
              </DialogHeader>
              
              {/* Products Section */}
              {(selectedSegment as any).products && (selectedSegment as any).products.length > 0 && (
                <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Product Categories
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {(selectedSegment as any).products.map((product: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-md bg-background px-3 py-2 text-sm"
                      >
                        <span className="text-muted-foreground">•</span>
                        <span>{product}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                {selectedSegment.companies.length > 0 ? (
                  <div>
                    <h4 className="mb-4 text-lg font-semibold">
                      Companies ({selectedSegment.companies.length})
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {selectedSegment.companies.map((ticker) => (
                        <CompanyCard key={ticker} ticker={ticker} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                    <p className="text-muted-foreground">
                      No companies currently listed in this segment
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Explanation Section */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding the {industryName} Value Chain</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold text-blue-600">Upstream</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {activeExplanations.upstream}
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-purple-600">Midstream</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {activeExplanations.midstream}
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-green-600">Downstream</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {activeExplanations.downstream}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
