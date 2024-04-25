install:
	go build -o $(HOME)/go/bin/algebra-prover ./main.go

config:
	# create log files
	sudo mkdir -p /var/log/algebra-fee-discount-prover
	sudo touch /var/log/algebra-fee-discount-prover
	# copying over systemd config files
	sudo cp configs/*.service /etc/systemd/system
	sudo systemctl daemon-reload
	sudo systemctl enable algebra-fee-discount-prover

start-fee-discount: config install
	sudo systemctl restart algebra-fee-discount-prover