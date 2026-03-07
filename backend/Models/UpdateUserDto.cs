namespace Backend.Models
{
    public class UpdateUserDto
    {
        public string FullName { get; set; } = "";
        public string DateOfBirth { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Address { get; set; } = "";
    }
}