import { Locale } from "next-intl"

export type Props = {
  children: ReactNode
  params: Promise<{ locale: Locale }>
}

export type TActivatorProps = {
  rawValue: ISelectedRange
  value?: string
}

type BasePlacement = 'top' | 'right' | 'bottom' | 'left'
type AlignedPlacement = `${BasePlacement}-start` | `${BasePlacement}-end`
export type Placement = BasePlacement | AlignedPlacement

export interface ISelectedRange {
  startDate: Date | null
  endDate: Date | null
}
