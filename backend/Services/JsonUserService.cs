using System.Text.Json;
using Backend.Models;

namespace Backend.Services
{
    public class JsonUserService
    {
        private readonly string _filePath;
        private readonly JsonSerializerOptions _jsonOptions;

        public JsonUserService(IWebHostEnvironment env)
        {
            _filePath = Path.Combine(env.ContentRootPath, "Data", "users.json");
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
        }

        private List<User> ReadAll()
        {
            if (!File.Exists(_filePath)) return new List<User>();
            var json = File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<List<User>>(json, _jsonOptions) ?? new List<User>();
        }

        public List<User> GetAll() => ReadAll();

        public User? GetById(int id) => ReadAll().FirstOrDefault(u => u.Id == id);

        public PagedResult<User> GetPaged(QueryParams query)
        {
            var users = ReadAll().AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var keyword = query.Search.ToLower();
                users = users.Where(u =>
                    u.FullName.ToLower().Contains(keyword) ||
                    u.Email.ToLower().Contains(keyword) ||
                    u.Phone.ToLower().Contains(keyword) ||
                    u.Code.ToLower().Contains(keyword)
                );
            }

            if (!string.IsNullOrWhiteSpace(query.Address))
            {
                users = users.Where(u =>
                    u.Address.ToLower().Contains(query.Address.ToLower()));
            }

            users = query.SortBy?.ToLower() switch
            {
                "fullname"    => query.SortDesc ? users.OrderByDescending(u => u.FullName)    : users.OrderBy(u => u.FullName),
                "email"       => query.SortDesc ? users.OrderByDescending(u => u.Email)       : users.OrderBy(u => u.Email),
                "dateofbirth" => query.SortDesc ? users.OrderByDescending(u => u.DateOfBirth) : users.OrderBy(u => u.DateOfBirth),
                _             => query.SortDesc ? users.OrderByDescending(u => u.Id)          : users.OrderBy(u => u.Id)
            };

            var totalRecords = users.Count();
            var totalPages   = (int)Math.Ceiling(totalRecords / (double)query.PageSize);
            var data         = users
                                .Skip((query.Page - 1) * query.PageSize)
                                .Take(query.PageSize)
                                .ToList();

            return new PagedResult<User>
            {
                Page         = query.Page,
                PageSize     = query.PageSize,
                TotalRecords = totalRecords,
                TotalPages   = totalPages,
                Data         = data
            };
        }
    }
}