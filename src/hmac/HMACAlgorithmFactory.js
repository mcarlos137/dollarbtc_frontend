import SHAHMACAlgorithm from "./SHAHMACAlgorithm";


export default class HMACAlgorithmFactory{

  createAlgorithm(algorithmName){
    if(algorithmName.startsWith("SHA")){
      return new SHAHMACAlgorithm(algorithmName.substring("SHA".length))
    }
    throw new Error("Algorithm "+algorithmName+" not supported");
  }
}