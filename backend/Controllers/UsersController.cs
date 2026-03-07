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
    }
}