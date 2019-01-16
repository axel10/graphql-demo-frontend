export type Maybe<T> = T | null

export interface PlayerInput {
  name: string

  birthPlace?: Maybe<string>

  height?: Maybe<string>

  weightLbs?: Maybe<number>

  birthDate?: Maybe<Date>
}

/** The `Date` scalar type represents a timestamp provided in UTC. `Date` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. */
export type Date = any

export type Decimal = any

// ====================================================
// Scalars
// ====================================================

// ====================================================
// Types
// ====================================================

export interface NhlStatsQuery {
  player?: Maybe<PlayerType>

  randomPlayer?: Maybe<PlayerType>

  players?: Maybe<Array<Maybe<PlayerType>>>

  teams?: Maybe<Array<Maybe<TeamType>>>
}

export interface PlayerType {
  id: number

  name?: Maybe<string>

  birthPlace: string

  height: string

  weightLbs: number

  birthDate?: Maybe<string>
  /** Player's skater stats */
  skaterSeasonStats?: Maybe<Array<Maybe<SkaterStatisticType>>>
}

export interface SkaterStatisticType {
  id: number

  seasonId: number

  season: string

  league: string

  team: string

  gp?: Maybe<number>

  goals?: Maybe<number>

  assists?: Maybe<number>

  points?: Maybe<number>

  plusMinus?: Maybe<number>
}

export interface TeamType {
  id: number

  name: string

  abbreviation: string
}

export interface CreatePlayerMutation {
  createPlayer?: Maybe<PlayerType>
}

// ====================================================
// Arguments
// ====================================================

export interface PlayerNhlStatsQueryArgs {
  id?: Maybe<number>
}
export interface SkaterSeasonStatsPlayerTypeArgs {
  id?: Maybe<number>
}
export interface CreatePlayerCreatePlayerMutationArgs {
  player: PlayerInput
}
