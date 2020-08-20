using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace jwt_asp_demo.Models
{
    public class Roles
    {
        public int Id { get; set; }

        [Required]
        public string Role { get; set; }

        public ICollection<User> Users { get; set; }

        public Roles()
        {
            Users = new Collection<User>();
        }
    }
}