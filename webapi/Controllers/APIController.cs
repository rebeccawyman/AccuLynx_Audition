using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using System.Net;
using System.Runtime.Serialization.Json;
using System.Text.Json;
using webapi.models;

namespace webapi.Controllers;

[ApiController]
[Route("api")]
public class APIController : ControllerBase
{
    private readonly ILogger<APIController> _logger;

    public APIController(ILogger<APIController> logger)
    {
        _logger = logger;
    }

    [HttpGet("GetQuestions")]
    public async Task<List<QuestionListModel>> GetAsync()
    {
        // Get the data.
        using (var client = new HttpClient(new HttpClientHandler { AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate }))
        {
            client.BaseAddress = new Uri("https://api.stackexchange.com/2.3");
            HttpResponseMessage response = await client.GetAsync("search/advanced?order=desc&sort=creation&accepted=True&answers=2&site=stackoverflow");

            List<QuestionListModel> result = new List<QuestionListModel>();
                
            if (response.IsSuccessStatusCode)
            {
                var data = response.Content.ReadAsStringAsync().Result;
                if(data != null)
                {
                    try
                    {
                        var model = JsonSerializer.Deserialize<StackOverflowSearchModel>(data);
                        if(model != null)
                        result = model.items.Select(x => new QuestionListModel { title = x.title, owner = x.owner.display_name, answer_count = x.answer_count, question_id = x.question_id, tags = String.Join(", ", x.tags.ToArray()) }).ToList();
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "unable to query data");
                    }
                }
            }
            return result;
        }
    }
}
