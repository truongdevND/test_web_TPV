using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/users")]
    public class UsersController : ControllerBase
    {
        private readonly JsonUserService _service;

        public UsersController(JsonUserService service)
        {
            _service = service;
        }

        // GET /api/v1/users
        [HttpGet]
        public IActionResult GetAll([FromQuery] QueryParams query)
        {
            try
            {
                if (query.Page < 1) query.Page = 1;
                if (query.PageSize < 1 || query.PageSize > 100) query.PageSize = 10;

                var result = _service.GetPaged(query);
                return StatusCode(200, ApiResponse<PagedResult<User>>.Ok(result, "Get users successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ServerError(ex.Message));
            }
        }

        // POST /api/v1/users
        [HttpPost]
        public IActionResult Create([FromBody] CreateUserDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return StatusCode(400, ApiResponse<string>.BadRequest("Validation failed"));

                var existingEmail = _service.GetAll()
                                            .FirstOrDefault(u => u.Email.ToLower() == dto.Email.ToLower());
                if (existingEmail != null)
                    return StatusCode(409, ApiResponse<string>.Conflict($"Email {dto.Email} already exists"));

                var existingCode = _service.GetAll()
                                           .FirstOrDefault(u => u.Code.ToLower() == dto.Code.ToLower());
                if (existingCode != null)
                    return StatusCode(409, ApiResponse<string>.Conflict($"Code {dto.Code} already exists"));

                var created = _service.Create(dto);
                return StatusCode(201, ApiResponse<User>.Created(created, "User created successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ServerError(ex.Message));
            }
        }

        // GET /api/v1/users/{id}
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                if (id <= 0)
                    return StatusCode(400, ApiResponse<string>.BadRequest("ID must be greater than 0"));

                var user = _service.GetById(id);
                if (user == null)
                    return StatusCode(404, ApiResponse<string>.NotFound($"User with ID = {id} not found"));

                return StatusCode(200, ApiResponse<User>.Ok(user, "Get user successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ServerError(ex.Message));
            }
        }

        // PUT /api/v1/users/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UpdateUserDto dto)
        {
            try
            {
                if (id <= 0)
                    return StatusCode(400, ApiResponse<string>.BadRequest("ID must be greater than 0"));

                var existing = _service.GetById(id);
                if (existing == null)
                    return StatusCode(404, ApiResponse<string>.NotFound($"User with ID = {id} not found"));

                _service.Update(id, dto);
                return StatusCode(200, ApiResponse<User>.Ok(_service.GetById(id)!, "User updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ServerError(ex.Message));
            }
        }

        // DELETE /api/v1/users/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                if (id <= 0)
                    return StatusCode(400, ApiResponse<string>.BadRequest("ID must be greater than 0"));

                var existing = _service.GetById(id);
                if (existing == null)
                    return StatusCode(404, ApiResponse<string>.NotFound($"User with ID = {id} not found"));

                _service.Delete(id);
                return StatusCode(200, ApiResponse<string>.Ok($"User ID = {id} deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ServerError(ex.Message));
            }
        }
    }
}