Vue.component( "pokemon-card", {
    template: `
        <div class="pokemon__slot" :class="{ 'pokemon__empty': pokemon === null }">
            <div v-if="pokemon !== null">
                <div class="pokemon__level" v-if="!getHideSetting('level')">
                    <span class="level">Lv. {{pokemon.level}}</span>
                    <img v-if="pokemon.isShiny == 1" class="shiny" src="./assets/images/party/shiny.png"/>
                </div>
                <div :class="{ 'pokemon__image': true, 'isDamaged': justTookDamage}">
                    <img :class="{ 'pokemon-fainted': pokemon.hp.current == 0 }" :src="imageSource(pokemon)">
                </div>
                <div class="pokemon__nickname" v-if="!getHideSetting('nickname')">
                    {{ fixedNickname(pokemon) }}
                </div>
                <div class="pokemon__hp-bar" v-if="!getHideSetting('hp')">
                    <div class="progress" style="height: 15px;">
                        <div :class="healthBarClass(pokemon)" v-bind:style="{width: healthBarPercent(pokemon) + '%'}" role="progressbar" :aria-valuenow="pokemon.hp.current" :aria-valuemin="0" :aria-valuemax="pokemon.hp.max"></div>
                    </div>
                    <div class="pokemon__hp">
                        <span class="text">{{ pokemon.hp.current }} / {{ pokemon.hp.max }}</span>
                    </div>
                </div>
                <div class="pokemon__bar" v-if="!getHideSetting('types')">
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
            if (pokemon.nickname.includes(pokemon.speciesName, 0)) {
                return pokemon.speciesName;
            } else {
                return pokemon.nickname;
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
