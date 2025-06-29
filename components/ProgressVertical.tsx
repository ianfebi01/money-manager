import React from 'react'
import Markdown from './Parsers/Markdown'

export interface IStep {
  name: string
  role: string
  description: string
  status: 'complete' | 'current' | 'upcoming'
}

interface Props {
  steps: IStep[]
}

const ProgressVertical: React.FC<Props> = ( { steps } ) => {
  return (
    <nav aria-label="Progress">
      <ol role="list"
        className="overflow-hidden"
      >
        {steps.map( ( step, stepIdx ) => (
          <li key={step.role}
            className={` relative`}
          >
            {step.status === 'complete' && (
              <>
                {stepIdx !== steps.length - 1 && (
                  <div
                    className="absolute left-2 top-4 -ml-px mt-0.5 h-full w-0.5 bg-[#4D4D4D]"
                    aria-hidden="true"
                  />
                )}
                <div className="group relative flex items-start">
                  <span className="flex h-7 items-center">
                    <span className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full bg-[#4D4D4D]"></span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <h4 className="h3">{step.role}</h4>
                    <Markdown content={step.description} />
                  </span>
                </div>
              </>
            )}
            {step.status === 'current' && (
              <>
                {stepIdx !== steps.length - 1 && (
                  <div
                    className="absolute left-2 top-4 -ml-px mt-0.5 h-full w-0.5 bg-[#4D4D4D]"
                    aria-hidden="true"
                  />
                )}
                <div className="group relative flex items-start mb-2">
                  <span className="flex h-7 items-center">
                    <span className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full bg-[#4D4D4D]"></span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <h4 className="h3">{step.role}</h4>
                    <Markdown content={step.description} />
                  </span>
                </div>
              </>
            )}
            {step.status === 'upcoming' && (
              <>
                {stepIdx !== steps.length - 1 && (
                  <div
                    className="absolute left-2 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                    aria-hidden="true"
                  />
                )}
                <div className="group relative flex items-start">
                  <span className="flex h-7 items-center"
                    aria-hidden="true"
                  >
                    <span className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                    </span>
                  </span>
                  <div className="group relative flex items-start">
                    <span className="flex h-7 items-center">
                      <span className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full bg-[#4D4D4D]"></span>
                    </span>
                    <span className="ml-4 flex min-w-0 flex-col">
                      <h4 className="h3">{step.role}</h4>
                      <Markdown content={step.description} />
                    </span>
                  </div>
                </div>
              </>
            )}
          </li>
        ) )}
      </ol>
    </nav>
  )
}

export default ProgressVertical
