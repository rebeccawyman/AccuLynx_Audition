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
    [HttpGet("GetQuestion/{id}")]
    public async Task<QuestionDisplayModel> GetQuestionAsync(int id)
    {
        // Get the data.
        using (var client = new HttpClient(new HttpClientHandler { AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate }))
        {
            QuestionDisplayModel result = new QuestionDisplayModel();

            client.BaseAddress = new Uri("https://api.stackexchange.com/2.3");

            HttpResponseMessage questionResponse = await client.GetAsync("questions/" + id.ToString() + "?order=desc&sort=activity&site=stackoverflow&filter=!nNPvSNPI7A");

            if (questionResponse.IsSuccessStatusCode)
            {
                var data = questionResponse.Content.ReadAsStringAsync().Result;
                if (data != null)
                {
                    try
                    {
                        var model = JsonSerializer.Deserialize<StackOverflowSearchModel>(data);
                        if (model != null)
                            result = model.items.Select(x => new QuestionDisplayModel { Title = x.title, Owner = x.owner.display_name, Body = x.body, Answers = new List<AnswerDisplayModel>() }).ToList().First();
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "unable to query data");
                    }
                }
            }

            HttpResponseMessage response = await client.GetAsync("questions/" + id.ToString() +"/answers?order=desc&sort=activity&site=stackoverflow&filter=!6WPIomp-eb(U5");

            if (response.IsSuccessStatusCode)
            {
                var data = response.Content.ReadAsStringAsync().Result;
                if (data != null)
                {
                    try
                    {
                        var model = JsonSerializer.Deserialize<StackOverflowAnswerModel>(data);
                        if (model != null)
                            result.Answers = model.items.Select(x => new AnswerDisplayModel { AnswerId = x.answer_id, Owner = x.owner.display_name, Body = x.body, IsAccepted = x.is_accepted, Link = x.link }).ToList();
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
