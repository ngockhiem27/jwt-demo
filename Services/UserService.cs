using System;
using System.Linq;
using System.Threading.Tasks;
using jwt_asp_demo.Data;
using jwt_asp_demo.Models;
using Microsoft.EntityFrameworkCore;

namespace jwt_demo.Services
{
    public interface IUserService
    {
        Task<User> RegisterUser(string username, string password, int roleId);
        Task<User> GetUser(string username, string password);
        User GetUserProfile(string username);
        bool IsExistingUser(string username);
    }
    public class UserService : IUserService
    {
        private readonly AppDbContext dbContext;

        public UserService(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<User> RegisterUser(string username, string password, int roleId)
        {
            if (IsExistingUser(username)) return null;
            var role = dbContext.Roles.Find(roleId);
            if (role == null) return null;
            User newUser = new User
            {
                UserName = username,
                Password = password,
                Role = role,
                RegisteredAt = DateTime.Now,
            };
            dbContext.Users.Add(newUser);
            await dbContext.SaveChangesAsync();
            return newUser;
        }

        public async Task<User> GetUser(string username, string password)
        {
            var user = (await dbContext.Users.Include(r => r.Role).ToListAsync()).Where(u => u.Password == password && u.UserName == username).FirstOrDefault();
            return user;
        }

        public bool IsExistingUser(string username)
        {
            var user = dbContext.Users.AsQueryable().Where(u => u.UserName == username).FirstOrDefault();
            if (user != null) return true;
            return false;
        }

        public User GetUserProfile(string username)
        {
            var user = dbContext.Users.Include(r => r.Role).AsQueryable().Where(u => u.UserName == username).FirstOrDefault();
            return user;
        }
    }
}