create services
1. discovery-service
	cf cups discovery-service-peer1 -p '{"uri" : "http://discovery-service.stg.ghama.io"}'
	cf cups discovery-service-peer2 -p '{"uri" : "http://discovery-service-peer2.stg.ghama.io"}'
2. configuration-service
	cf cups configuration-service -p '{"uri" : "http://configuration-service.stg.ghama.io"}'
3. trace-monitoring-dashboard
	cf cups trace-monitoring-dashboard -p '{"uri" : "http://trace-monitoring-dashboard.stg.ghama.io"}'

