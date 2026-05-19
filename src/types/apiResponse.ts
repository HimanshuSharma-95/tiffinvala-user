
export interface ApiResponse<T> {
    statuscode: number
    data: T
    success: boolean
    message: string
}