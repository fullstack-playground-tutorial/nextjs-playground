import { BaseSearchService, Filter } from "../base/search/search"

export interface User {
    id?: string
    username?: string
    email?: string
    phone?: string
}

export interface UserFilter extends Filter {
    username?: string
    email?: string
}

export interface UserSearchService extends BaseSearchService<User, UserFilter>{}