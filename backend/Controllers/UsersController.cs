using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly JsonUserService _service;

        public UsersController(JsonUserService service)
        {
            _service = service;
        }

        // GET /api/users?page=1&pageSize=10&search=an&address=hanoi&sortBy=fullname&sortDesc=false
        [HttpGet]
        public IActionResult GetAll([FromQuery] QueryParams query)
        {
            try
            {
                // Validate
                if (query.Page < 1) query.Page = 1;
                if (query.PageSize < 1 || query.PageSize > 100) query.PageSize = 10;

                var result = _service.GetPaged(query);

                return StatusCode(200, new ApiResponse<PagedResult<User>>
                {
                    StatusCode   = 200,
                    Success      = true,
                    Message      = "Get users successfully",
                    Data         = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ServerError(ex.Message));
            }
        }
[HttpGet("{id}")]
public IActionResult GetById(int id)
{
    try
    {
        if (id <= 0)
            return StatusCode(400, new ApiResponse<string>
            {
                StatusCode = 400,
                Success    = false,
                Message    = "ID must be greater than 0",
                Data       = null
            });

        var user = _service.GetById(id);

        if (user == null)
            return StatusCode(404, new ApiResponse<string>
            {
                StatusCode = 404,
                Success    = false,
                Message    = $"User with ID = {id} not found",
                Data       = null
            });

        return StatusCode(200, new ApiResponse<User>
        {
            StatusCode = 200,
            Success    = true,
            Message    = "Get user successfully",
            Data       = user
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, ApiResponse<string>.ServerError(ex.Message));
    }
}
    }
}