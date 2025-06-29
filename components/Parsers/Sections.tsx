import { cn } from '@/lib/utils'
import componentResolver from '@/utils/component-resolver'
import Markdown from './Markdown'

interface Props {
  sections: any
  headingLevel: 1 | 2
}

const getSection = (
  sectionData: any,
  index: number,
  headingLevel: 1 | 2 = 2
) => {
  const bgColour =
    sectionData?.sectionSettings?.bgColour?.data?.attributes?.name || ''

  return (
    <div
      key={index}
      className={cn( {
        'bg-dark'                                     : bgColour === 'dark',
        'bg-dark-secondary'                           : bgColour === 'dark-secondary',
        'bg-orange'                                   : bgColour === 'orange',
        'bg-green'                                    : bgColour === 'green',
        'bg-white'                                    : bgColour === 'white',
        'last:border-b-[0.5px] last:border-[#707070]' : bgColour === 'blue-dark',

        'last:pb-8 last:lg:pb-16' : !sectionData.sectionSettings?.paddingBottom,

        'pt-0'  : sectionData.sectionSettings?.paddingTop === 'pt-0',
        'pt-2'  : sectionData.sectionSettings?.paddingTop === 'pt-2',
        'pt-4'  : sectionData.sectionSettings?.paddingTop === 'pt-4',
        'pt-6'  : sectionData.sectionSettings?.paddingTop === 'pt-6',
        'pt-8'  : sectionData.sectionSettings?.paddingTop === 'pt-8',
        'pt-10' : sectionData.sectionSettings?.paddingTop === 'pt-10',
        'pt-12' : sectionData.sectionSettings?.paddingTop === 'pt-12',
        'pt-8 md:pt-16' :
          sectionData.sectionSettings?.paddingTop === 'pt-16' ||
          ( !sectionData?.sectionSettings?.heading &&
            !sectionData?.sectionSettings?.description &&
            !sectionData.sectionSettings?.paddingTop ),
        'pt-20' : sectionData.sectionSettings?.paddingTop === 'pt-20',
        'pt-24' : sectionData.sectionSettings?.paddingTop === 'pt-24',

        'pb-0'          : sectionData.sectionSettings?.paddingBottom === 'pb-0',
        'pb-2'          : sectionData.sectionSettings?.paddingBottom === 'pb-2',
        'pb-4'          : sectionData.sectionSettings?.paddingBottom === 'pb-4',
        'pb-6'          : sectionData.sectionSettings?.paddingBottom === 'pb-6',
        'pb-8'          : sectionData.sectionSettings?.paddingBottom === 'pb-8',
        'pb-10'         : sectionData.sectionSettings?.paddingBottom === 'pb-10',
        'pb-12'         : sectionData.sectionSettings?.paddingBottom === 'pb-12',
        'pb-8 lg:pb-16' : sectionData.sectionSettings?.paddingBottom === 'pb-16' || !sectionData.sectionSettings?.paddingBottom,
        'pb-20'         : sectionData.sectionSettings?.paddingBottom === 'pb-20',
        'pb-24'         : sectionData.sectionSettings?.paddingBottom === 'pb-24',

        'mt-0'  : sectionData.sectionSettings?.marginTop === 'mt-0',
        'mt-2'  : sectionData.sectionSettings?.marginTop === 'mt-2',
        'mt-4'  : sectionData.sectionSettings?.marginTop === 'mt-4',
        'mt-6'  : sectionData.sectionSettings?.marginTop === 'mt-6',
        'mt-8'  : sectionData.sectionSettings?.marginTop === 'mt-8',
        'mt-10' : sectionData.sectionSettings?.marginTop === 'mt-10',
        'mt-12' : sectionData.sectionSettings?.marginTop === 'mt-12',
        'mt-16' : sectionData.sectionSettings?.marginTop === 'mt-16',
        'mt-20' : sectionData.sectionSettings?.marginTop === 'mt-20',
        'mt-24' : sectionData.sectionSettings?.marginTop === 'mt-24',

        'mb-0'  : sectionData.sectionSettings?.marginBottom === 'mb-0',
        'mb-2'  : sectionData.sectionSettings?.marginBottom === 'mb-2',
        'mb-4'  : sectionData.sectionSettings?.marginBottom === 'mb-4',
        'mb-6'  : sectionData.sectionSettings?.marginBottom === 'mb-6',
        'mb-8'  : sectionData.sectionSettings?.marginBottom === 'mb-8',
        'mb-10' : sectionData.sectionSettings?.marginBottom === 'mb-10',
        'mb-12' : sectionData.sectionSettings?.marginBottom === 'mb-12',
        'mb-16' : sectionData.sectionSettings?.marginBottom === 'mb-16',
        'mb-20' : sectionData.sectionSettings?.marginBottom === 'mb-20',
        'mb-24' : sectionData.sectionSettings?.marginBottom === 'mb-24',
      } )}
    >
      <div
        className={cn( {
          'max-w-7xl px-6 lg:px-8 mx-auto' :
            ![
              'content-components.text-left-image-right',
              'content-components.small-banner',
            ]?.includes( sectionData.__component ) && !sectionData.fullWidth,
        } )}
      >
        {( !!sectionData?.sectionSettings?.heading ||
          !!sectionData?.sectionSettings?.description ) && (
          <div
            className={cn( 'mx-auto pb-12', {
              'text-center max-w-5xl' : sectionData?.sectionSettings?.centreText,
              'text-blue-dark'        : !['blue-dark'].includes( bgColour ),
              'text-white'            : ['blue-dark'].includes( bgColour ),
            } )}
          >
            {!!sectionData?.sectionSettings?.heading && (
              <div className="pt-16">
                {headingLevel === 1 && (
                  <h1
                    className={cn( 'font-extra-bold normal-case', {
                      'drop-shadow-md' :
                        sectionData?.sectionSettings?.textDropShadow,
                      'text-3xl md:text-[2.25rem] md:leading-[2.5rem] xxl:text-[2.5rem] xxl:leading-[2.75rem]' :
                        sectionData?.sectionSettings?.largeHeading,
                    } )}
                  >
                    {sectionData?.sectionSettings?.heading}
                  </h1>
                )}

                {headingLevel === 2 && (
                  <h2
                    className={cn( '!font-primary font-extra-bold', {
                      '!text-[1.7rem] md:text-[2.25rem] md:leading-[2.5rem] xxl:text-[2.5rem] xxl:leading-[2.75rem]' :
                        sectionData?.sectionSettings?.largeHeading,
                      'text-xl xxl:text-[1.5625rem]' :
                        !sectionData?.sectionSettings?.headingLarge,
                    } )}
                  >
                    {sectionData?.sectionSettings?.heading}
                  </h2>
                )}
              </div>
            )}

            {!!sectionData?.sectionSettings?.description && (
              <div
                className={cn( 'mt-2 text-lg body-copy', {
                  'drop-shadow-md' :
                    sectionData?.sectionSettings?.textDropShadow,
                } )}
              >
                <Markdown content={sectionData?.sectionSettings?.description} />
              </div>
            )}
          </div>
        )}

        <div>{componentResolver( sectionData, index )}</div>
      </div>
    </div>
  )
}

const Sections = ( { sections, headingLevel = 2 }: Props ) => {
  return sections.map( ( sections: any, index: number ) =>
    getSection( sections, index, headingLevel )
  )
}

export default Sections
