const SkeletonExpenseDoughnutChart = () => {
  return (
    <div className="p-8 flex flex-col md:flex-row w-full gap-4 animate-pulse lg:h-[300px]">
      <div className="rounded-full h-[250px] w-[250px] lg:h-[240px] lg:w-[240px] bg-dark/25 flex items-center justify-center mx-auto">
        <div className="rounded-full aspect-square w-2/3 bg-dark-secondary " />
      </div>
      <div className="flex flex-col gap-4 p-4 grow">
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-block w-3 h-8 rounded-full bg-dark/25" />
          <div className="h-3 w-full bg-dark/25" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-block w-3 h-8 rounded-full bg-dark/25" />
          <div className="h-3 w-full bg-dark/25" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-block w-3 h-8 rounded-full bg-dark/25" />
          <div className="h-3 w-full bg-dark/25" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-block w-3 h-8 rounded-full bg-dark/25" />
          <div className="h-3 w-full bg-dark/25" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonExpenseDoughnutChart
