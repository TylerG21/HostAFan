using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Vehicles;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/vehicles")]
    [ApiController]
    public class VehicleApiController : BaseApiController
    {
        private IVehiclesService _service = null;
        private IAuthenticationService<int> _authService = null;
       
        public VehicleApiController(IVehiclesService service, 
            ILogger<VehicleApiController> logger, 
            IAuthenticationService<int> authService): base(logger)
        {
            _service = service;
            _authService = authService;
        }


        [HttpGet("current")]
        public ActionResult<ItemsResponse<Vehicle>> GetCurrent()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                List<Vehicle> vehicles = _service.GetByCreatedBy(userId);

                if (vehicles == null)
                {
                    code = 404;
                    response = new ErrorResponse("Location not found");
                }
                else
                {
                    response = new ItemsResponse<Vehicle> { Items = vehicles };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Location Error: {ex.Message}");
            }

            return StatusCode(code, response);

        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(VehicleAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                int createdBy = _service.Add(model, userId);

                ItemResponse<int> response = new ItemResponse<int>() { Item = createdBy };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }

            return result;
           
        }


        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(VehicleUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                _service.Update(model, userId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }
    }

    }

