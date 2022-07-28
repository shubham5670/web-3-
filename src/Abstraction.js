import { BscConnector } from '@binance-chain/bsc-connector'

export const Abstraction = new BscConnector({
  supportedChainIds: [56, 97]
})

// invoke method on bsc e.g.
export const fu = async () => {
    await Abstraction.activate().then((res)=>{
        console.log("ggggggggggg",res);
    })

    await Abstraction.getAccount().then((res)=>{
        console.log("llllllllllllllllll",res);
    })
    await Abstraction.getChainId().then((res)=>{
        console.log("pppppppppppppppppppp",res);
    })
    await Abstraction.getProvider().then((res)=>{
        console.log("pppppppppppppppppppp",res);
    })
}



