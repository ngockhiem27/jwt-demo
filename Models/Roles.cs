using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace jwt_asp_demo.Models
{
    public class Roles
    {
        public int Id { get; set; }

        [Required]
        public string Role { get; set; }

        public List<User> Users { get; set; }
    }
}