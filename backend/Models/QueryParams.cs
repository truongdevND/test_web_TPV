namespace Backend.Models
{
    public class QueryParams
    {
        public int Page { get; set; } = 1;          
        public int PageSize { get; set; } = 10;     
        public string? Search { get; set; }         
        public string? Address { get; set; }        
        public string? SortBy { get; set; }         
        public bool SortDesc { get; set; } = false; 
    }
}