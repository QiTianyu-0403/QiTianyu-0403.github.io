# pathutil 0.16.2 passes keyword arguments as a positional Hash on Ruby 3.
require "pathutil"

class Pathutil
  def read(*args, **options)
    options[:encoding] ||= encoding
    content = File.read(self, *args, **options)
    normalize[:read] ? content.encode(universal_newline: true) : content
  end
end
