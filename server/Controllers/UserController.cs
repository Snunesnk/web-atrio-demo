using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace server.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{

    private readonly DatabaseContext _context;
    public UserController(DatabaseContext context)
    {
        _context = context;
    }


    [HttpGet]
    public async Task<IEnumerable<User>> GetUsersByCompany(string? company)
    {
        if (string.IsNullOrEmpty(company))
        {
            return await _context.Users.ToListAsync();
        }

        return await _context.Users.Include(user => user.Jobs).Where(user => user.Jobs != null && user.Jobs.Any(job => string.Equals(job.Company, company))).ToListAsync();
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] User user)
    {

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(user);
    }

    [HttpGet("jobs")]
    public async Task<IEnumerable<User>> GetUserWithJobs()
    {
        return await _context.Users.Include(user => user.Jobs).OrderBy(user => user.FirstName).ToListAsync();
    }
}
