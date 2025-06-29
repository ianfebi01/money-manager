'use client'
import { FunctionComponent, useMemo } from 'react'
import { ApiExperienceExperience } from '@/types/generated/contentTypes'
import Markdown from './Parsers/Markdown'
import ProgressVertical, { IStep } from './ProgressVertical'

interface Props {
  data: ApiExperienceExperience[]
}

const Experience: FunctionComponent<Props> = ( { data } ) => {
  const groupedAndSorted = useMemo(
    () =>
      data.reduce<Record<string, ApiExperienceExperience[]>>( ( acc, item ) => {
        // Group by companyName
        if ( !acc[item.attributes.companyName] ) {
          acc[item.attributes.companyName] = []
        }
        acc[item.attributes.companyName].push( item )

        // Sort items in the group by endDate in descending order, prioritizing null or missing endDate
        acc[item.attributes.companyName].sort( ( a, b ) => {
          const aEndDate = a.attributes.endDate
            ? new Date( a.attributes.endDate ).getTime()
            : null
          const bEndDate = b.attributes.endDate
            ? new Date( b.attributes.endDate ).getTime()
            : null

          // Handle null or missing endDate
          if ( aEndDate === null && bEndDate !== null ) return -1 // a comes first
          if ( bEndDate === null && aEndDate !== null ) return 1 // b comes first
          if ( aEndDate === null && bEndDate === null ) return 0 // equal

          // Sort by endDate in descending order
          return bEndDate! - aEndDate!
        } )

        return acc
      }, {} ),
    [data]
  )

  // console.log( groupedAndSorted )

  const transformedData: {
    companyName: string
    totalWorkingMonths: number
    steps: IStep[]
  }[] = useMemo(
    () =>
      Object.entries( groupedAndSorted ).map( ( [companyName, experiences] ) => {
        // Calculate total working months for this company
        const totalWorkingMonths = experiences.reduce( ( total, item ) => {
          const startDate = new Date( item.attributes.startDate )
          const endDate = item.attributes.endDate
            ? new Date( item.attributes.endDate )
            : new Date() // Use current date if endDate is null
          const months =
            ( endDate.getFullYear() - startDate.getFullYear() ) * 12 +
            ( endDate.getMonth() - startDate.getMonth() )

          return total + months
        }, 0 )

        return {
          companyName        : companyName,
          totalWorkingMonths : totalWorkingMonths,
          steps              : experiences.map( ( item ) => ( {
            description : String( item.attributes.description ),
            name        : String( item.attributes.companyName ),
            role        : String( item.attributes.role ),
            status :
              item.attributes.endDate &&
              new Date( item.attributes.endDate ) < new Date()
                ? 'complete'
                : 'current',
          } ) ),
        }
      } ),
    [groupedAndSorted]
  )

  function convertMonthsToYearsAndMonths( totalMonths: number ): string {
    const years = Math.floor( totalMonths / 12 ) // Calculate the number of years
    const months = totalMonths % 12 // Calculate the remaining months

    const yearText = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : ''
    const monthText =
      months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''

    // Combine year and month text with appropriate spacing
    return [yearText, monthText].filter( Boolean ).join( ' ' )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-dark px-4 py-6 rounded-3xl divide-y-[1px] divide-white-overlay-2">
        {transformedData.map( ( item ) => (
          <div key={item.companyName}
            className="pt-4 first:pt-0"
          >
            {item.steps.length > 1 && (
              <>
                <h3>{item.companyName}</h3>
                <p className="mt-0 mb-2 text-sm">
                  {convertMonthsToYearsAndMonths( item.totalWorkingMonths )}
                </p>
              </>
            )}
            <div>
              {item.steps.length > 1 ? (
                <ProgressVertical steps={item.steps} />
              ) : (
                item.steps.map( ( step, i ) => (
                  <div key={i}
                    className="group relative flex items-start"
                  >
                    <span className="ml-4 flex min-w-0 flex-col">
                      <h4 className="h3">{step.role}</h4>
                      <p className="mt-0 mb-2 text-sm">
                        {convertMonthsToYearsAndMonths( item.totalWorkingMonths )}
                      </p>
                      <p className="mt-0 mb-2 text-sm text-white-overlay">
                        {step.name}
                      </p>
                      <Markdown content={step.description} />
                    </span>
                  </div>
                ) )
              )}
            </div>
          </div>
        ) )}
        {/* <ProgressVertical steps={steps} /> */}
      </div>
    </div>
  )
}

export default Experience
