export class Asset {
    
    // @ts-ignore
    constructor(public id: number = null,
                public name: string,
                public category: number,
                public src: string,
                public folder: number,
                public format: string,
                public cover: string,
                public favorite: boolean) {

    }
}
