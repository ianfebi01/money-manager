import NextTopLoader from 'nextjs-toploader'

const TopLoader = () => {
  return (
    <NextTopLoader
      color="#F26B50"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px #F26B50,0 0 5px #F26B50"
    />
  )
}

export default TopLoader