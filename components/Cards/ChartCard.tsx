import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { ReactNode } from 'react'
import NoDataFound from '../NoDataFound'
import ErrorLoadingData from '../Layouts/ErrorLoadingData'

interface Props {
  filterComponent?: ReactNode
  loaderComponent?: ReactNode
  isLoading?: boolean
  isNoData?: boolean
  isError?: boolean
  children: ReactNode
  title: string
}
const ChartCard = ( {
  filterComponent,
  loaderComponent,
  isLoading,
  isNoData,
  isError,
  children,
  title,
}: Props ) => {
  return (
    <div className="bg-dark-secondary rounded-lg md:h-[365px] overflow-hidden flex flex-col">
      <div className="p-4 flex justify-between gap-4 items-center">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faArrowRightArrowLeft}
            className="text-orange"
          />
          <h4>{title}</h4>
        </div>
        {!!filterComponent && <div>{filterComponent}</div>}
      </div>

      {!isLoading && !isNoData && !isError && children}
      {!isLoading && isNoData && !isError && (
        <div className="p-8 flex flex-col gap-4 h-[280px]">
          <NoDataFound size="sm" />
        </div>
      )}
      {isLoading && loaderComponent}
      {!isLoading && isError && (
        <div className="p-8 flex flex-col gap-4 h-[280px]">
          <ErrorLoadingData size="sm" />
        </div>
      )}
    </div>
  )
}

export default ChartCard
