const SkeletonMonthlyChart = () => {
  return (
    <div className="p-8 flex flex-col gap-4 animate-pulse h-[200px] md:h-[300px]">
      <div className="flex h-full gap-6">
        <div className="w-8 h-full flex flex-col justify-between">
          <div className="w-full h-2 bg-dark/25 rounded-sm" />
          <div className="w-full h-2 bg-dark/25 rounded-sm" />
          <div className="w-full h-2 bg-dark/25 rounded-sm" />
          <div className="w-full h-2 bg-dark/25 rounded-sm" />
          <div className="w-full h-2 bg-dark/25 rounded-sm" />
        </div>
        <div className="grid grid-cols-5 gap-2 h-full w-full">
          <div className="w-full h-full mt-auto flex gap-1">
            <div className="w-full h-full bg-dark/25 rounded-lg mt-auto"></div>
            <div className="w-full h-1/3 bg-dark/25 rounded-lg mt-auto"></div>
          </div>
          <div className="w-full h-full mt-auto flex gap-1">
            <div className="w-full h-1/3 bg-dark/25 rounded-lg mt-auto"></div>
            <div className="w-full h-1/4 bg-dark/25 rounded-lg mt-auto"></div>
          </div>
          <div className="w-full h-full mt-auto flex gap-1">
            <div className="w-full h-2/3 bg-dark/25 rounded-lg mt-auto"></div>
            <div className="w-full h-1/2 bg-dark/25 rounded-lg mt-auto"></div>
          </div>
          <div className="w-full h-full mt-auto flex gap-1">
            <div className="w-full h-4/6 bg-dark/25 rounded-lg mt-auto"></div>
            <div className="w-full h-3/5 bg-dark/25 rounded-lg mt-auto"></div>
          </div>
          <div className="w-full h-full mt-auto flex gap-1">
            <div className="w-full h-5/6 bg-dark/25 rounded-lg mt-auto"></div>
            <div className="w-full h-1/5 bg-dark/25 rounded-lg mt-auto"></div>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center gap-2">
        <div className="h-4 w-5 bg-dark/25 rounded-sm"></div>
        <div className="h-4 w-40 bg-dark/25 rounded-sm"></div>
      </div>
    </div>
  )
}

export default SkeletonMonthlyChart
