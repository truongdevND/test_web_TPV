namespace Backend.Models
{
    public class ApiResponse<T>
    {
        public int StatusCode { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; } = "";
        public T? Data { get; set; }

        // 200 - OK
        public static ApiResponse<T> Ok(T data, string message = "Success")
        {
            return new ApiResponse<T>
            {
                StatusCode = 200,
                Success = true,
                Message = message,
                Data = data
            };
        }

        // 201 - Created
        public static ApiResponse<T> Created(T data, string message = "Created successfully")
        {
            return new ApiResponse<T>
            {
                StatusCode = 201,
                Success = true,
                Message = message,
                Data = data
            };
        }

        // 400 - Bad Request
        public static ApiResponse<T> BadRequest(string message = "Bad request")
        {
            return new ApiResponse<T>
            {
                StatusCode = 400,
                Success = false,
                Message = message,
                Data = default
            };
        }

        // 404 - Not Found
        public static ApiResponse<T> NotFound(string message = "Not found")
        {
            return new ApiResponse<T>
            {
                StatusCode = 404,
                Success = false,
                Message = message,
                Data = default
            };
        }

        // 409 - Conflict
        public static ApiResponse<T> Conflict(string message = "Conflict")
        {
            return new ApiResponse<T>
            {
                StatusCode = 409,
                Success = false,
                Message = message,
                Data = default
            };
        }

        // 500 - Internal Server Error
        public static ApiResponse<T> ServerError(string message = "Internal server error")
        {
            return new ApiResponse<T>
            {
                StatusCode = 500,
                Success = false,
                Message = message,
                Data = default
            };
        }
    }
}