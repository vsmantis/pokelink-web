const ExpCurveMod = Object.freeze({"default":0, "all":1, "legendaries":2, "strong_legendaries":3})

var themeSettings = {
    theme: {
        name: 'vsmantis-gba',
        hide: {
            level: false,
            nickname: false,
            hp: false,
            types: false,
        }
    },
    pokeImg:{
    	fileType: 'png',
    	useDexNumbers: true,
    },
    imgPaths:{
    	normal: 'https://pokelink.cybershade.org/assets/sprites/pokemon/trozei/'
    },
    expCurveMod: ExpCurveMod.default
};
