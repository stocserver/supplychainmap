import { ValueChainStageProducts } from "@/lib/data/industries"

export const mediaEntertainmentProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Content Creation',
    layout: 'flow',
    products: [
      {
        id: 'content-production',
        name: 'Content Production',
        description: 'Film, TV, and digital content production',
        longDescription: 'Companies that produce original content including movies, television shows, documentaries, and digital content for various platforms.',
        companiesDetailed: [
          { name: 'Walt Disney', ticker: 'DIS', listing: 'US' },
          { name: 'Netflix', ticker: 'NFLX', listing: 'US' },
          { name: 'Warner Bros. Discovery', ticker: 'WBD', listing: 'US' },
          { name: 'Comcast', ticker: 'CMCSA', listing: 'US' },
          { name: 'Paramount Global', ticker: 'PARA', listing: 'US' },
          { name: 'Sony Pictures', ticker: 'SONY', listing: 'ADR' },
          { name: 'Lionsgate', ticker: 'LGF.A', listing: 'US' },
          { name: 'AMC Networks', ticker: 'AMCX', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'film-production',
            name: 'Film Production',
            description: 'Feature film and movie production',
            companiesDetailed: [
              { name: 'Walt Disney', ticker: 'DIS', listing: 'US' },
              { name: 'Warner Bros. Discovery', ticker: 'WBD', listing: 'US' },
              { name: 'Sony Pictures', ticker: 'SONY', listing: 'ADR' }
            ]
          },
          {
            id: 'tv-production',
            name: 'Television Production',
            description: 'TV shows and series production',
            companiesDetailed: [
              { name: 'Netflix', ticker: 'NFLX', listing: 'US' },
              { name: 'Comcast', ticker: 'CMCSA', listing: 'US' },
              { name: 'Paramount Global', ticker: 'PARA', listing: 'US' }
            ]
          }
        ],
        tags: ['Content', 'Production', 'Film', 'Television']
      },
      {
        id: 'game-development',
        name: 'Game Development',
        description: 'Video game development and publishing',
        longDescription: 'Companies that develop, publish, and distribute video games across various platforms including consoles, PC, and mobile.',
        companiesDetailed: [
          { name: 'Electronic Arts', ticker: 'EA', listing: 'US' },
          { name: 'Activision Blizzard', ticker: 'ATVI', listing: 'US' },
          { name: 'Take-Two Interactive', ticker: 'TTWO', listing: 'US' },
          { name: 'Ubisoft', ticker: 'UBSFY', listing: 'ADR' },
          { name: 'CD Projekt', ticker: 'OTGLY', listing: 'ADR' },
          { name: 'Roblox', ticker: 'RBLX', listing: 'US' },
          { name: 'Unity Software', ticker: 'U', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'console-games',
            name: 'Console Games',
            description: 'Games for PlayStation, Xbox, Nintendo',
            companiesDetailed: [
              { name: 'Electronic Arts', ticker: 'EA', listing: 'US' },
              { name: 'Activision Blizzard', ticker: 'ATVI', listing: 'US' },
              { name: 'Take-Two Interactive', ticker: 'TTWO', listing: 'US' }
            ]
          },
          {
            id: 'mobile-games',
            name: 'Mobile Games',
            description: 'Games for smartphones and tablets',
            companiesDetailed: [
              { name: 'Roblox', ticker: 'RBLX', listing: 'US' },
              { name: 'Unity Software', ticker: 'U', listing: 'US' }
            ]
          }
        ],
        tags: ['Gaming', 'Development', 'Publishing', 'Interactive']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Distribution & Platforms',
    layout: 'hybrid',
    products: [
      {
        id: 'streaming-platforms',
        name: 'Streaming Platforms',
        description: 'Video streaming and on-demand services',
        longDescription: 'Companies that operate streaming platforms and video-on-demand services for distributing content to consumers.',
        companiesDetailed: [
          { name: 'Netflix', ticker: 'NFLX', listing: 'US' },
          { name: 'Walt Disney', ticker: 'DIS', listing: 'US' },
          { name: 'Warner Bros. Discovery', ticker: 'WBD', listing: 'US' },
          { name: 'Comcast', ticker: 'CMCSA', listing: 'US' },
          { name: 'Paramount Global', ticker: 'PARA', listing: 'US' },
          { name: 'Apple', ticker: 'AAPL', listing: 'US' },
          { name: 'Amazon', ticker: 'AMZN', listing: 'US' },
          { name: 'Roku', ticker: 'ROKU', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'subscription-streaming',
            name: 'Subscription Streaming',
            description: 'Monthly subscription video services',
            companiesDetailed: [
              { name: 'Netflix', ticker: 'NFLX', listing: 'US' },
              { name: 'Walt Disney', ticker: 'DIS', listing: 'US' },
              { name: 'Warner Bros. Discovery', ticker: 'WBD', listing: 'US' }
            ]
          },
          {
            id: 'ad-supported-streaming',
            name: 'Ad-Supported Streaming',
            description: 'Free streaming with advertising',
            companiesDetailed: [
              { name: 'Roku', ticker: 'ROKU', listing: 'US' },
              { name: 'Paramount Global', ticker: 'PARA', listing: 'US' },
              { name: 'Comcast', ticker: 'CMCSA', listing: 'US' }
            ]
          }
        ],
        tags: ['Streaming', 'On-Demand', 'Subscription', 'Platforms']
      },
      {
        id: 'social-media',
        name: 'Social Media Platforms',
        description: 'Social networking and user-generated content',
        longDescription: 'Companies that operate social media platforms, enabling users to create, share, and interact with content.',
        companiesDetailed: [
          { name: 'Meta Platforms', ticker: 'META', listing: 'US' },
          { name: 'Snap', ticker: 'SNAP', listing: 'US' },
          { name: 'Pinterest', ticker: 'PINS', listing: 'US' },
          { name: 'LinkedIn', ticker: 'MSFT', listing: 'US' },
          { name: 'Reddit', ticker: 'RDDT', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'social-networking',
            name: 'Social Networking',
            description: 'General social media platforms',
            companiesDetailed: [
              { name: 'Meta Platforms', ticker: 'META', listing: 'US' },
              { name: 'LinkedIn', ticker: 'MSFT', listing: 'US' }
            ]
          },
          {
            id: 'visual-content',
            name: 'Visual Content Platforms',
            description: 'Image and video sharing platforms',
            companiesDetailed: [
              { name: 'Snap', ticker: 'SNAP', listing: 'US' },
              { name: 'Pinterest', ticker: 'PINS', listing: 'US' }
            ]
          }
        ],
        tags: ['Social Media', 'User-Generated Content', 'Networking', 'Community']
      },
      {
        id: 'traditional-media',
        name: 'Traditional Media',
        description: 'Broadcast television and radio',
        longDescription: 'Companies that operate traditional broadcast media including television networks, radio stations, and cable channels.',
        companiesDetailed: [
          { name: 'Comcast', ticker: 'CMCSA', listing: 'US' },
          { name: 'Walt Disney', ticker: 'DIS', listing: 'US' },
          { name: 'Warner Bros. Discovery', ticker: 'WBD', listing: 'US' },
          { name: 'Paramount Global', ticker: 'PARA', listing: 'US' },
          { name: 'Fox Corporation', ticker: 'FOX', listing: 'US' },
          { name: 'Sinclair Broadcast Group', ticker: 'SBGI', listing: 'US' },
          { name: 'Gray Television', ticker: 'GTN', listing: 'US' },
          { name: 'Nexstar Media Group', ticker: 'NXST', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'cable-networks',
            name: 'Cable Networks',
            description: 'Cable television programming',
            companiesDetailed: [
              { name: 'Comcast', ticker: 'CMCSA', listing: 'US' },
              { name: 'Walt Disney', ticker: 'DIS', listing: 'US' },
              { name: 'Warner Bros. Discovery', ticker: 'WBD', listing: 'US' }
            ]
          },
          {
            id: 'broadcast-tv',
            name: 'Broadcast Television',
            description: 'Over-the-air television stations',
            companiesDetailed: [
              { name: 'Fox Corporation', ticker: 'FOX', listing: 'US' },
              { name: 'Sinclair Broadcast Group', ticker: 'SBGI', listing: 'US' },
              { name: 'Gray Television', ticker: 'GTN', listing: 'US' }
            ]
          }
        ],
        tags: ['Broadcast', 'Cable', 'Television', 'Radio']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Monetization & Services',
    layout: 'grid',
    products: [
      {
        id: 'advertising',
        name: 'Digital Advertising',
        description: 'Online advertising and marketing services',
        longDescription: 'Companies that provide digital advertising platforms, ad technology, and marketing services for brands and advertisers.',
        companiesDetailed: [
          { name: 'Google', ticker: 'GOOGL', listing: 'US' },
          { name: 'Meta Platforms', ticker: 'META', listing: 'US' },
          { name: 'Amazon', ticker: 'AMZN', listing: 'US' },
          { name: 'The Trade Desk', ticker: 'TTD', listing: 'US' },
          { name: 'Roku', ticker: 'ROKU', listing: 'US' },
          { name: 'Snap', ticker: 'SNAP', listing: 'US' },
          { name: 'Pinterest', ticker: 'PINS', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'search-advertising',
            name: 'Search Advertising',
            description: 'Search engine advertising',
            companiesDetailed: [
              { name: 'Google', ticker: 'GOOGL', listing: 'US' },
              { name: 'Microsoft', ticker: 'MSFT', listing: 'US' }
            ]
          },
          {
            id: 'social-advertising',
            name: 'Social Media Advertising',
            description: 'Advertising on social platforms',
            companiesDetailed: [
              { name: 'Meta Platforms', ticker: 'META', listing: 'US' },
              { name: 'Snap', ticker: 'SNAP', listing: 'US' },
              { name: 'Pinterest', ticker: 'PINS', listing: 'US' }
            ]
          }
        ],
        tags: ['Advertising', 'Digital Marketing', 'Ad Tech', 'Monetization']
      },
      {
        id: 'live-entertainment',
        name: 'Live Entertainment',
        description: 'Live events, concerts, and entertainment venues',
        longDescription: 'Companies that produce and operate live entertainment events including concerts, sports, theater, and entertainment venues.',
        companiesDetailed: [
          { name: 'Live Nation Entertainment', ticker: 'LYV', listing: 'US' },
          { name: 'Madison Square Garden', ticker: 'MSGS', listing: 'US' },
          { name: 'Dolphin Entertainment', ticker: 'DLPN', listing: 'US' },
          { name: 'Eventbrite', ticker: 'EB', listing: 'US' },
          { name: 'Ticketmaster', ticker: 'LYV', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'concert-promotion',
            name: 'Concert Promotion',
            description: 'Live music events and concerts',
            companiesDetailed: [
              { name: 'Live Nation Entertainment', ticker: 'LYV', listing: 'US' },
              { name: 'Madison Square Garden', ticker: 'MSGS', listing: 'US' }
            ]
          },
          {
            id: 'ticketing-platforms',
            name: 'Ticketing Platforms',
            description: 'Event ticketing and management',
            companiesDetailed: [
              { name: 'Eventbrite', ticker: 'EB', listing: 'US' },
              { name: 'Ticketmaster', ticker: 'LYV', listing: 'US' }
            ]
          }
        ],
        tags: ['Live Events', 'Concerts', 'Ticketing', 'Entertainment']
      }
    ]
  }
]
