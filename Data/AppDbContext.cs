using jwt_asp_demo.Models;
using Microsoft.EntityFrameworkCore;

namespace jwt_asp_demo.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Roles> Roles { get; set; }
    }
}