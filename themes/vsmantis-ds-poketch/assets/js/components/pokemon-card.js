Vue.component( "pokemon-card", {
    template: `
        <div class="pokemon__slot" :class="{ 'pokemon__empty': pokemon === null }">
            <div v-if="pokemon !== null">
                <div class="pokemon__level" v-if="!getHideSetting('level')">
                    <span v-if="!pokemon.isEgg" class="level">Lv. {{pokemon.level}}</span>
                    <img v-if="pokemon.isShiny == 1 && !pokemon.isEgg" class="shiny" src="./assets/images/party/shiny.png"/>
                </div>
                <div v-if="!pokemon.isEgg" :class="{ 'pokemon__image': true, 'isDamaged': justTookDamage}">
                    <img :class="{ 'pokemon-fainted': pokemon.hp.current == 0 }" :src="imageSource(pokemon)">
                </div>
                <div v-if="pokemon.isEgg" class="pokemon__image">
                    <img src="./assets/images/party/egg-sprite.png">
                </div>
                <div class="pokemon__nickname" v-if="!getHideSetting('nickname')">
                    {{ fixedNickname(pokemon) }}
                </div>
                <div class="pokemon__hp-bar" v-if="!getHideSetting('hp')">
                    <div class="progress" style="height: 16px;">
                        <div v-if="!pokemon.isEgg" :class="healthBarClass(pokemon)" v-bind:style="{width: healthBarPercent(pokemon) + '%'}" role="progressbar" :aria-valuenow="pokemon.hp.current" :aria-valuemin="0" :aria-valuemax="pokemon.hp.max"></div>
                    </div>
                    <div class="progress" style="height: 14px;">
                        <div class="exp-bar"  v-bind:style="{ width: experienceRemaining(pokemon) }" role="expbar" :aria-valuenow="pokemon.hp.current" :aria-valuemin="0" :aria-valuemax="pokemon.hp.max"></div>
                    </div>
                    <div v-if="!pokemon.isEgg" class="pokemon__hp">
                        <span class="text">{{ pokemon.hp.current }} / {{ pokemon.hp.max }}</span>
                    </div>
                </div>
                <div v-if="!pokemon.isEgg" class="pokemon__info">
                    <img class="pokemon__type" v-if="pokemon.types.length != 0 && !pokemon.isEgg" v-for="type in pokemon.types" :src="typeImage(type)"/>
                    <img class="pokemon__status" v-if="statusImage(pokemon) != '' && !pokemon.isEgg" :src="statusImage(pokemon)"/>
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
            console.log(pokemon);
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
        typeImage: function(type) {
            return './assets/images/party/type/type-' + type.label.toLowerCase() + '.png';
        },
        statusImage: function(pokemon) {
            if (pokemon.hp.current == 0) {
                return './assets/images/party/status/status-fainted.png';
            } else if (pokemon.status.brn) {
                return './assets/images/party/status/status-burned.png';
            } else if (pokemon.status.fzn) {
                return './assets/images/party/status/status-frozen.png';
            } else if (pokemon.status.par) {
                return './assets/images/party/status/status-paralysis.png';
            } else if (pokemon.status.psn) {
                return './assets/images/party/status/status-poisoned.png';
            } else if (pokemon.status.bps) {
                return './assets/images/party/status/status-badly-poisoned.png';
            } else if (pokemon.status.slp) {
                return './assets/images/party/status/status-asleep.png';
            } else {
                return '';
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
            const expGroup = exp_groups_table.find(group => pokemon.species === group.id)
            const levelExp = experience_table.filter((expRange) => {
              return expRange.level === pokemon.level+1
                  || expRange.level === pokemon.level
            })
      
            const totalExpForThisRange = levelExp[1][expGroup['levelling_type']] - levelExp[0][expGroup['levelling_type']]
            const expLeftInThisRange = pokemon.exp - levelExp[0][expGroup['levelling_type']]

            console.log((100/totalExpForThisRange) * expLeftInThisRange + '%')

            return (100/totalExpForThisRange) * expLeftInThisRange + '%'
        },
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
