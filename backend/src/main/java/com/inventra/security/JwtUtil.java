package com.inventra.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private static final SecretKey key =
        Keys.hmacShaKeyFor(
            "inventra-secret-key-should-be-very-long-123456"
            .getBytes()
        );

    public String generateToken(String username, String role) {

        long expiry = role.equals("ADMIN")
            ? 1000L * 60 * 60 * 24 * 7   // 7 days
            : 1000L * 60 * 30;         // 30 min

        return Jwts.builder()
            .setSubject(username)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiry))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
    }

    public Claims validateToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
}
