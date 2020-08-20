using System;
using System.ComponentModel.DataAnnotations;

namespace jwt_asp_demo.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public DateTime RegisteredAt { get; set; }

        [Required]
        public Roles Role { get; set; }
    }
}