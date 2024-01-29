using System.ComponentModel.DataAnnotations;

public class BirthDateValidation : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        if (value is DateTime birthDate)
        {
            if (birthDate > DateTime.UtcNow)
            {
                return new ValidationResult("Birthdate cannot be in the future.");
            }

            if (DateTime.UtcNow.Year - birthDate.Year >= 150)
            {
                return new ValidationResult("Age must be less than 150 years.");
            }

            return ValidationResult.Success;
        }

        return new ValidationResult("Invalid date format.");
    }
}