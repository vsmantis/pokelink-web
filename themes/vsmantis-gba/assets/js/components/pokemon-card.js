Vue.component( "pokemon-card", {
    template: `
        <div class="pokemon__slot" :class="{ 'pokemon__empty': pokemon === null }">
            <div v-if="pokemon !== null">
                <div class="pokemon__level">
                    <img v-if="!pokemon.isEgg && !getHideSetting('gender') && !(isGenderless(pokemon) && getHideSetting('genderless'))" class="gender" :src="genderIcon(pokemon)"/>
                    <span v-if="!pokemon.isEgg" class="level"><span>Lv. {{ pokemon.level }}</span>
                    <img v-if="pokemon.isShiny == 1 && !pokemon.isEgg && !getHideSetting('shiny')" class="shiny" src="./assets/images/party/shiny.png"/>
                </div>
                <div v-if="!pokemon.isEgg" :class="{ 'pokemon__image': true, 'isDamaged': justTookDamage}">
                    <img :class="{ 'pokemon-fainted': pokemon.hp.current == 0 }" :src="imageSource(pokemon)">
                </div>
                <div v-if="pokemon.isEgg" class="pokemon__image">
                    <img src="./assets/images/party/egg-sprite.png">
                </div>
                <div class="pokemon__nickname">
                    {{ fixedNickname(pokemon) }}
                </div>
                <div class="pokemon__bars">
                    <div class="progress progress-hp">
                        <div :class="healthBarClass(pokemon)" v-bind:style="{width: healthBarPercent(pokemon) + '%'}" role="progressbar" :aria-valuenow="pokemon.hp.current" :aria-valuemin="0" :aria-valuemax="pokemon.hp.max"></div>
                    </div>
                    <div class="progress progress-xp">
                    <div class="exp-bar"  v-bind:style="{ width: experienceRemaining(pokemon) }"></div>
                    </div>
                    <div v-if="!pokemon.isEgg" class="pokemon__hp">
                        <span class="text">{{ pokemon.hp.current }} / {{ pokemon.hp.max }}</span>
                    </div>
                </div>
                <div v-if="!pokemon.isEgg" class="pokemon__bar">
                    <span :class="'pokemon__types pokemon__types-' + type.label.toLowerCase()" v-if="pokemon.types.length != 0" v-for="type in pokemon.types">{{type.label}}</span>
                </div>
                <div :class="statusContainerClass(pokemon)" v-if="!getHideSetting('status')">
                    <div :class="statusClass(pokemon)"></div>
                </div>
            </div>
            <div v-else>
            </div>
        </div>
    `,
    props: {
        pokemon: {
            default: null,
            type: Object,
            required: false
        }
    },
    methods: {
        imageSource: function(pokemon) {

            return 'https://assets.pokelink.xyz/assets/sprites/pokemon/trozei/' + pokemon.species + '.png';
        },
        healthBarPercent: function(pokemon) {

            if (pokemon.hp.max === pokemon.hp.current) {
                return 100;
            } else {
                return (100/pokemon.hp.max) * pokemon.hp.current;
            }
        },
        healthBarClass: function(pokemon) {

            var redHP = Math.ceil(pokemon.hp.max * 0.205);
            var yellowHP = Math.ceil(pokemon.hp.max * 0.515);
            
            if (pokemon.hp.current == 0) {
                return 'progress-bar grey';
            } else if (pokemon.hp.current <= redHP) {
                return 'progress-bar red';
            } else if (pokemon.hp.current <= yellowHP) {
                return 'progress-bar yellow';
            } else {
                return 'progress-bar green';
            }
        },
        getHideSetting(setting) {

            return settings.theme.hide[setting] || false;
        },
        statusClass: function(pokemon) {

            if (pokemon.hp.current == 0) {
                return 'status status-fainted';
            } else if (pokemon.status.brn) {
                return 'status status-burned';
            } else if (pokemon.status.fzn) {
                return 'status status-frozen';
            } else if (pokemon.status.par) {
                return 'status status-paralysis';
            } else if (pokemon.status.psn) {
                return 'status status-poisoned';
            } else if (pokemon.status.bps) {
                return 'status status-badly-poisoned';
            } else if (pokemon.status.slp) {
                return 'status status-asleep';
            } else {
                return 'status status-normal';
            }
        },
        statusContainerClass: function(pokemon) {

            var statusClass = this.statusClass(pokemon);

            if (pokemon.hp.current == 0) {
                return 'pokemon__status fainted';
            } else if (statusClass != 'status status-normal') {
                return 'pokemon__status has-status-condition';
            } else {
                return 'pokemon__status';
            }
        },
        fixedNickname: function(pokemon) {

            if (pokemon.isEgg) {
                return 'EGG';
            } else if (pokemon.nickname.includes(pokemon.speciesName, 0)) {
                return pokemon.speciesName;
            } else {
                return pokemon.nickname;
            }
        },
        experienceRemaining: function(pokemon) {

            const expCurveMod = settings.expCurveMod
            var expGroup = exp_groups_table.find(group => pokemon.species === group.id)
            
            if (expCurveMod == ExpCurveMod.all) {
                expGroup = {'levelling_type': 'medium_fast'};
            } else if (expCurveMod == ExpCurveMod.legendaries) {
                expGroup = legendaries_table.includes(pokemon.species) ? {'levelling_type': 'slow'} : {'levelling_type': 'medium_fast'};
            } else if (expCurveMod == ExpCurveMod.strongLegendaries) {
                expGroup = strong_legendaries_table.includes(pokemon.species) ? {'levelling_type': 'slow'} : {'levelling_type': 'medium_fast'};
            }

            const levelExp = experience_table.filter((expRange) => {
                return expRange.level === pokemon.level + 1 || expRange.level === pokemon.level
            })
      
            const totalExpForThisRange = levelExp[1][expGroup['levelling_type']] - levelExp[0][expGroup['levelling_type']]
            const expLeftInThisRange = pokemon.exp - levelExp[0][expGroup['levelling_type']]

            // console.log((100/totalExpForThisRange) * expLeftInThisRange + '%')

            return (100/totalExpForThisRange) * expLeftInThisRange + '%'
        },
        isGenderless: function(pokemon) {

            return gender_threshold = gender_table.find(group => pokemon.species === group.id).threshold == 255
        },
        genderIcon: function(pokemon) {

            const gender_threshold = gender_table.find(group => pokemon.species === group.id).threshold
            const personality_gender_value = pokemon.pid % 256;
            
            console.log("=======");
            console.log(gender_threshold);
            console.log(personality_gender_value);

            if (gender_threshold == 255) {
                return './assets/images/party/gender/gender-genderless.png';
            } else if (gender_threshold == 254) {
                return './assets/images/party/gender/gender-female.png';
            } else if (gender_threshold == 0) {
                return './assets/images/party/gender/gender-male.png';
            } else if (personality_gender_value < gender_threshold) {
                return './assets/images/party/gender/gender-female.png';
            } else {
                return './assets/images/party/gender/gender-male.png';
            }
        }
    },
    watch: {
        pokemon: {
            handler (val, oldVal) {

                try {
                    if (val.hp.current < oldVal.hp.current) {
                        this.justTookDamage = true
                        setTimeout(() => {
                            this.justTookDamage = false
                        }, 1000)
                    }
                } catch (e) {
                    return
                }
            }
        }
    },
    data () {

        return {
            settings: {},
            justTookDamage: false
        }
    }
});
