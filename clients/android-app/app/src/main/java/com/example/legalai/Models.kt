package com.example.legalai

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class SearchRequest(val query: String, val limit: Int = 10)

@JsonClass(generateAdapter = true)
data class SearchResult(val id: String, val title: String?, val text: String?, val vector_distance: Double?)

@JsonClass(generateAdapter = true)
data class SearchResponse(val query: String, val results: List<SearchResult> = emptyList())
