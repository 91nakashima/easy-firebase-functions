type WhereOption = [
  string,
  (
    | '<'
    | '<='
    | '=='
    | '>'
    | '>='
    | 'array-contains'
    | 'array-contains-any'
    | 'in'
    | 'not-in'
  ),
  string | number
]

interface QueryOption {
  where?: Array<WhereOption>
  orderBy?: string
  limit?: number
}

export { WhereOption, QueryOption }
