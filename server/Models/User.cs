using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    [Required(ErrorMessage = "First name is required.")]
    public string? FirstName { get; set; }
    [Required(ErrorMessage = "Last name is required.")]
    public string? LastName { get; set; }
    [Required(ErrorMessage = "Birthdate is required.")]
    [DataType(DataType.Date)]
    [BirthDateValidation(ErrorMessage = "Birthdate must be a valid date and user must be under 150 years old.")]
    public DateTime? BirthDate { get; set; }
    public List<Job>? Jobs { get; set; }
}