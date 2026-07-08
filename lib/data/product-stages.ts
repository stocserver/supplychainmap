import type { ValueChainStageProducts } from './industries'
import { aerospaceProductStages } from '@/lib/industries/aerospace-defense.products'
import { agtechProductStages } from '@/lib/industries/agtech.products'
import { artificialIntelligenceProductStages } from '@/lib/industries/artificial-intelligence.products'
import { assetManagementProductStages } from '@/lib/industries/asset-management.products'
import { automotiveProductStages } from '@/lib/industries/automotive.products'
import { bankingProductStages } from '@/lib/industries/banking.products'
import { biotechnologyProductStages } from '@/lib/industries/biotechnology.products'
import { chemicalsProductStages } from '@/lib/industries/chemicals.products'
import { cloudProductStages } from '@/lib/industries/cloud-computing.products'
import { constructionEngineeringProductStages } from '@/lib/industries/construction-engineering.products'
import { consumerElectronicsProducts } from '@/lib/industries/consumer-electronics.products'
import { consumerProductsProductStages } from '@/lib/industries/consumer-products.products'
import { cyberProductStages } from '@/lib/industries/cybersecurity.products'
import { dataCenterProductStages } from '@/lib/industries/data-centers.products'
import { digitalHealthProductStages } from '@/lib/industries/digital-health.products'
import { ecommerceProductStages } from '@/lib/industries/ecommerce.products'
import { evProductStages } from '@/lib/industries/electric-vehicles.products'
import { energyStorageProductStages } from '@/lib/industries/energy-storage.products'
import { fintechProductStages } from '@/lib/industries/fintech.products'
import { foodBeverageProductStages } from '@/lib/industries/food-beverage.products'
import { heavyIndustryProducts } from '@/lib/industries/heavy-industry.products'
import { hospitalityProductStages } from '@/lib/industries/hospitality.products'
import { insuranceProductStages } from '@/lib/industries/insurance.products'
import { mediaEntertainmentProductStages } from '@/lib/industries/media-entertainment.products'
import { medicalDevicesProductStages } from '@/lib/industries/medical-devices.products'
import { miningMaterialsProductStages } from '@/lib/industries/mining-materials.products'
import { oilGasProductStages } from '@/lib/industries/oil-gas.products'
import { pharmaceuticalProductStages } from '@/lib/industries/pharmaceuticals.products'
import { realEstateProductStages } from '@/lib/industries/real-estate.products'
import { retailProductStages } from '@/lib/industries/retail.products'
import { roboticsAutomationProductStages } from '@/lib/industries/robotics-automation.products'
import { semiconductorProductStages } from '@/lib/industries/semiconductors.products'
import { softwareSaaSProductStages } from '@/lib/industries/software-saas.products'
import { solarProductStages } from '@/lib/industries/solar-energy.products'
import { spaceTechnologyProductStages } from '@/lib/industries/space-technology.products'
import { telecommunicationsProductStages } from '@/lib/industries/telecommunications.products'
import { transportationLogisticsProductStages } from '@/lib/industries/transportation-logistics.products'
import { utilitiesProductStages } from '@/lib/industries/utilities.products'
import { wholesaleTradingProducts } from '@/lib/industries/wholesale-trading.products'

export const productStagesByIndustry: Record<string, ValueChainStageProducts[]> = {
  'aerospace-defense': aerospaceProductStages,
  agtech: agtechProductStages,
  'artificial-intelligence': artificialIntelligenceProductStages,
  'asset-management': assetManagementProductStages,
  automotive: automotiveProductStages,
  banking: bankingProductStages,
  biotechnology: biotechnologyProductStages,
  chemicals: chemicalsProductStages,
  'cloud-computing': cloudProductStages,
  'construction-engineering': constructionEngineeringProductStages,
  'consumer-electronics': consumerElectronicsProducts,
  'consumer-products': consumerProductsProductStages,
  cybersecurity: cyberProductStages,
  'data-centers': dataCenterProductStages,
  'digital-health': digitalHealthProductStages,
  ecommerce: ecommerceProductStages,
  'electric-vehicles': evProductStages,
  'energy-storage': energyStorageProductStages,
  fintech: fintechProductStages,
  'food-beverage': foodBeverageProductStages,
  'heavy-industry': heavyIndustryProducts,
  hospitality: hospitalityProductStages,
  insurance: insuranceProductStages,
  'media-entertainment': mediaEntertainmentProductStages,
  'medical-devices': medicalDevicesProductStages,
  'mining-materials': miningMaterialsProductStages,
  'oil-gas': oilGasProductStages,
  pharmaceuticals: pharmaceuticalProductStages,
  'real-estate': realEstateProductStages,
  retail: retailProductStages,
  'robotics-automation': roboticsAutomationProductStages,
  semiconductors: semiconductorProductStages,
  'software-saas': softwareSaaSProductStages,
  'solar-energy': solarProductStages,
  'space-technology': spaceTechnologyProductStages,
  telecommunications: telecommunicationsProductStages,
  'transportation-logistics': transportationLogisticsProductStages,
  utilities: utilitiesProductStages,
  'wholesale-trading': wholesaleTradingProducts,
}
