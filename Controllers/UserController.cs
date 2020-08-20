using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using jwt_asp_demo.Data;
using jwt_demo.Infrastructure;
using jwt_demo.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace jwt_demo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IJwtAuthManager _jwtAuthManager;

        public UserController(IUserService userService, IJwtAuthManager _jwtAuthManager)
        {
            this._jwtAuthManager = _jwtAuthManager;
            this._userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid) return BadRequest();
            var user = await _userService.RegisterUser(request.Username, request.Password, request.RoleId);
            if (user == null)
                return BadRequest("user already exist");
            var claims = new[] {
                new Claim(ClaimTypes.Name, request.Username),
                new Claim(ClaimTypes.Role, user.Role.Role)
            };
            var jwtResult = _jwtAuthManager.GenerateTokens(user.UserName, claims, DateTime.Now);
            LoginResponse loginResult = new LoginResponse
            {
                Username = user.UserName,
                Role = user.Role.Role,
                AccessToken = jwtResult.AccessToken,
                RefreshToken = jwtResult.RefreshToken.TokenString,
            };
            return Ok(loginResult);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid) return BadRequest();
            var user = await _userService.GetUser(request.Username, request.Password);
            if (user == null)
                return NotFound("user not found");

            var claims = new Claim[] {
                new Claim(ClaimTypes.Name, request.Username),
                new Claim(ClaimTypes.Role, user.Role.Role)
            };
            var jwtResult = _jwtAuthManager.GenerateTokens(user.UserName, claims, DateTime.Now);
            LoginResponse loginResult = new LoginResponse
            {
                Username = user.UserName,
                Role = user.Role.Role,
                AccessToken = jwtResult.AccessToken,
                RefreshToken = jwtResult.RefreshToken.TokenString,
            };
            return Ok(loginResult);
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            _jwtAuthManager.RemoveRefreshTokenByUserName(User.Identity.Name);
            return Ok();
        }

        [Authorize]
        [HttpGet("[action]")]
        public IActionResult Profile()
        {
            var user = _userService.GetUserProfile(User.Identity.Name);
            if (user == null) return NotFound();
            return Ok(new ProfileResponse
            {
                Username = user.UserName,
                Role = user.Role.Role,
                RegisteredAt = user.RegisteredAt,
            });
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest refreshToken)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(refreshToken.RefreshToken)) return Unauthorized();
                var userName = User.Identity.Name;
                var accessToken = await HttpContext.GetTokenAsync("Bearer", "access_token");
                var jwtResult = _jwtAuthManager.Refresh(refreshToken.RefreshToken, accessToken, DateTime.Now);
                return Ok(new LoginResponse
                {
                    Username = userName,
                    Role = User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty,
                    AccessToken = jwtResult.AccessToken,
                    RefreshToken = jwtResult.RefreshToken.TokenString,
                });
            }
            catch (SecurityTokenException e)
            {
                return Unauthorized(e.Message);
            }
        }
    }

    public class RegisterRequest
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public int RoleId { get; set; }
    }
    public class LoginRequest
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }

    public class LoginResponse
    {
        public string Username { get; set; }

        public string Role { get; set; }

        public string AccessToken { get; set; }

        public string RefreshToken { get; set; }
    }

    public class ProfileResponse
    {
        public string Username { get; set; }

        public string Role { get; set; }

        public DateTime RegisteredAt { get; set; }
    }

    public class RefreshTokenRequest
    {
        [JsonPropertyName("refreshToken")]
        public string RefreshToken { get; set; }
    }

    public class ImpersonationRequest
    {
        [JsonPropertyName("username")]
        public string UserName { get; set; }
    }
}