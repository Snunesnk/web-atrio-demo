using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Server.Models;

public class Job
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    [Required(ErrorMessage = "Title is required.")]
    public string? Title { get; set; }
    [Required(ErrorMessage = "Description is required.")]
    [DataType(DataType.Date)]
    public DateTime? DateStarted { get; set; }
    public DateTime? DateEnded { get; set; }
    [Required(ErrorMessage = "Company is required.")]
    public string? Company { get; set; }
    [Required(ErrorMessage = "User is required.")]
    public int? UserId { get; set; }
    [JsonIgnore]
    public User? User { get; set; }
}