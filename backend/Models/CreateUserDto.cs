using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class CreateUserDto
    {
        [Required(ErrorMessage = "Code is required")]
        public string Code { get; set; } = "";

        [Required(ErrorMessage = "FullName is required")]
        public string FullName { get; set; } = "";

        public string DateOfBirth { get; set; } = "";

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Email is not valid")]
        public string Email { get; set; } = "";

        [Required(ErrorMessage = "Phone is required")]
        [Phone(ErrorMessage = "Phone is not valid")]
        public string Phone { get; set; } = "";

        public string Address { get; set; } = "";
    }
}