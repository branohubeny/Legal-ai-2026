package com.example.legalai

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface ApiService {
  @POST("api/v1/search")
  suspend fun search(@Body req: SearchRequest): SearchResponse

  @GET("api/legal-documents")
  suspend fun getDocs(): List<Map<String, Any>>
}
