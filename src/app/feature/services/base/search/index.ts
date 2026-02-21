// import { HeaderType } from "@/app/utils/http/headers";
// import { Filter, BaseSearchService as BaseSearchService } from "./search";
// import { ResponseError } from "@/app/utils/exception/model/response-error";
// export * from "./search";

// DEPRECATED
// export class BaseSearchClient<T, F extends Filter> implements BaseSearchService<T, F> {
//     private searchGet?: boolean = false
//     constructor(private url: string) {
//         this.search = this.search.bind(this)
//     }

//     async search(filter: F, userAgent: string, ip: string, deviceId: string): Promise<T[]> {
//         try {
//             const res = await fetch(`${this.url}/login`, {
//                 method: 'POST',
//                 headers: {
//                     [HeaderType.contentType]: 'application/json',
//                     [HeaderType.deviceId]: deviceId,
//                     [HeaderType.userAgent]: userAgent,
//                     [HeaderType.xForwardedFor]: ip,
//                 },
//                 body: JSON.stringify(filter),
//                 cache: 'no-cache'
//             })

//             const response = await res.json()

//             if (!res.ok) {
//                 throw new ResponseError(response, res.status, response)
//             }

//             return response as T[]

//         } catch (err: unknown) {
//             throw err
//         }

//     }
// }
