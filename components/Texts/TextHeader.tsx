import React, { FunctionComponent } from 'react'
interface Props {
  title: string
  subtitle: string
}
const TextHeader: FunctionComponent<Props> = ( props ) => {
  const { title, subtitle } = props
	
  return (
    <div className="flex flex-col">
      <h2 className="text-3xl m-0">{title}</h2>
      <p className="text-sm text-white-overlay">{subtitle}</p>
    </div>
  )
}

export default TextHeader
