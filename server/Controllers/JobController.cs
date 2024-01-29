using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace server.Controllers;

[ApiController]
[Route("[controller]")]
public class JobController : ControllerBase
{

    private readonly DatabaseContext _context;
    public JobController(DatabaseContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IEnumerable<Job>> Get()
    {
        return await _context.Jobs.ToListAsync();
    }

    [HttpGet("companies")]
    public async Task<IEnumerable<string?>> GetCompanies()
    {
        return await _context.Jobs.Select(job => job.Company).Distinct().ToListAsync();
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Job job)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }


        if (job.DateEnded != null && !DateTime.TryParse(job.DateEnded.ToString(), out var dateEnded))
        {
            ModelState.AddModelError("DateEnded", "Date ended must be a valid date.");
            return BadRequest(ModelState);
        }

        if (job.DateEnded != null && job.DateStarted > job.DateEnded)
        {
            ModelState.AddModelError("DateEnded", "Date ended must be after date started.");
            return BadRequest(ModelState);
        }

        _context.Jobs.Add(job);
        await _context.SaveChangesAsync();

        return Ok(job);
    }

    [HttpGet("user/{userId}/{startDate}/{endDate}")]
    public async Task<IActionResult> GetJobsByUser(int userId, string startDate, string endDate)
    {
        var user = await _context.Users.Include(user => user.Jobs).FirstOrDefaultAsync(user => user.Id == userId);
        if (user == null || user.Jobs == null)
        {
            return NotFound();
        }

        DateTime StartDate;
        DateTime EndDate;

        if (!DateTime.TryParse(startDate, out StartDate))
        {
            ModelState.AddModelError("StartDate", "Start date must be a valid date.");
            Console.WriteLine(startDate);
            return BadRequest(ModelState);
        }

        if (!DateTime.TryParse(endDate, out EndDate))
        {
            ModelState.AddModelError("EndDate", "End date must be a valid date.");
            return BadRequest(ModelState);
        }

        var jobs = user.Jobs.Where(job => job.DateStarted >= StartDate && job.DateEnded <= EndDate).ToList();
        return Ok(jobs);
    }
}
