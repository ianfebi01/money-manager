import { PluginUploadFile } from "@/types/generated/contentTypes"

const isVideo = ( imageObj: PluginUploadFile ) => {
  return /^video/.test( imageObj?.attributes?.mime )
}

export default isVideo
